<?php

namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\ChemExtension\Pages\ChemForm;
use DIQA\ChemExtension\Utils\CurlUtil;
use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Request\DocumentQuery;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\Model\Common\Order;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Request\PropertyFacet;
use DIQA\FacetedSearch2\Model\Common\Range;
use DIQA\FacetedSearch2\Model\Request\Sort;
use DIQA\FacetedSearch2\Model\Request\StatsQuery;
use DIQA\FacetedSearch2\Model\Response\SolrDocumentsResponse;
use DIQA\FacetedSearch2\Model\Response\SolrFacetResponse;
use DIQA\FacetedSearch2\Model\Response\SolrStatsResponse;
use Exception;
use MediaWiki\MediaWikiServices;
use Title;

class SolrRequestClient
{


    public function requestDocuments(DocumentQuery $q): SolrDocumentsResponse
    {
        $queryParams = $this->getParams($q->searchText, $q->propertyFacets, $q->categoryFacets,
            $q->namespaceFacets, $q->extraProperties);
        $sortsAndLimits = $this->getSortsAndLimits($q->sorts, $q->limit, $q->offset);
        $queryParams = array_merge($queryParams, $sortsAndLimits);

        $response =  new SolrResponseParser($this->requestSOLR($queryParams));
        return $response->parse();
    }

    public function requestStats(StatsQuery $q): SolrStatsResponse
    {
        $queryParams = $this->getParams($q->searchText, $q->propertyFacets, $q->categoryFacets,
            $q->namespaceFacets, []);
        $queryParams['stats'] = 'true';
        $statsFields = [];
        foreach($q->statsProperties as $p) {
            $statsFields[] = Helper::generateSOLRPropertyForSearch($p->title, $p->type);
        }
        $queryParams['stats.field'] = $statsFields;
        $response =  new SolrResponseParser($this->requestSOLR($queryParams));
        return $response->parseStatsResponse();
    }

    public function requestFacet(FacetQuery $q): SolrFacetResponse
    {
        $queryParams = $this->getParams($q->searchText, $q->propertyFacets, $q->categoryFacets,
            $q->namespaceFacets, []);

        foreach ($q->getFacetProperties() as $v) {
            /* @var $v Property */
            $queryParams['facet.field'][] = Helper::generateSOLRPropertyForSearch($v->title, $v->type);
        }

        $facetQueries = [];
        foreach($q->facetQueries as $p) {
            $property = Helper::generateSOLRPropertyForSearch($p->property, $p->type);
            $range = self::encodeRange($p->range, $p->type);
            $facetQueries[] = $property .":[" . $range . "]";
        }
        $queryParams['facet.query'] = $facetQueries;
        $response =  new SolrResponseParser($this->requestSOLR($queryParams));
        return $response->parseFacetResponse();
    }

    /**
     * Sends a document to Tika and extracts text. If Tika does not
     * know the format, an empty string is returned.
     *
     *  - PDF
     *  - DOC/X (Microsoft Word)
     *  - PPT/X (Microsoft Powerpoint)
     *  - XLS/X (Microsoft Excel)
     *
     * @param mixed $title Title or filepath
     *         Title object of document (must be of type NS_FILE)
     *         or a filepath in the filesystem
     * @return array e.g. [ text => extracted text of document, xml => full XML-response of Tika ]
     * @throws Exception
     */
    public function extractDocument($title) {
        if ($title instanceof Title) {
            $file = MediaWikiServices::getInstance()->getRepoGroup()->getLocalRepo()->newFile($title);
            $filepath = $file->getLocalRefPath();
        } else {
            $filepath = $title;
        }

        // get file and extension
        $ext = pathinfo($filepath, PATHINFO_EXTENSION);

        // choose content type
        if ($ext == 'pdf') {
            $contentType = 'application/pdf';
        } else if ($ext == 'doc' || $ext == 'docx') {
            $contentType = 'application/msword';
        } else if ($ext == 'ppt' || $ext == 'pptx') {
            $contentType = 'application/vnd.ms-powerpoint';
        } else if ($ext == 'xls' || $ext == 'xlsx') {
            $contentType = 'application/vnd.ms-excel';
        } else {
            // general binary data as fallback (don't know if Tika accepts it)
            $contentType = 'application/octet-stream';
        }

        // do not index unknown formats
        if ($contentType == 'application/octet-stream') {
            return [];
        }

        // send document to Tika and extract text
        try {
            $result = $this->requestSOLRExtract(file_get_contents($filepath), $contentType);

            $xml = $result->{''};
            $text = strip_tags(str_replace('<', ' <', $xml));

            $text = preg_replace('/\s\s*/', ' ', $text);

            if ($text == '') {
                throw new Exception(sprintf("\nWARN Kein extrahierter Text gefunden: %s\n", $title->getPrefixedText()));
            }

            return ['xml' => $xml, 'text' => $text];
        } catch (Exception $e) {
            throw new Exception(sprintf("\nERROR Keine Extraktion möglich: %s (HTTP code: %s)\n",
                $title->getPrefixedText(), $e->getCode()));
        }
    }

    private function getParams(string $searchText,
                               array $propertyFacetConstraints, /* @var PropertyFacet[] */
                               array $categoryFacets, /* @var string [] */
                               array $namespaceFacets, /* @var number[] */
                               array $extraProperties /* @var PropertyFacet[] */
    )
    {


        $defaultProperties = [
            'smwh__MDAT_datevalue_l',
            'smwh_categories',
            'smwh_directcategories',
            'smwh_attributes',
            'smwh_properties',
            'smwh_title',
            'smwh_namespace_id',
            'id',
            'score',
            'smwh_displaytitle'
        ];

        $extraPropertiesAsStrings = array_map(fn(Property $e) => Helper::generateSOLRProperty($e->title, $e->type), $extraProperties);

        $params = [];
        $params['defType'] = 'edismax';
        $params['boost'] = 'max(smwh_boost_dummy)';
        $params['facet'] = 'true';
        $params['facet.field'] = ['smwh_categories', 'smwh_attributes', 'smwh_properties', 'smwh_namespace_id'];


        $params['facet.mincount'] = '1';
        $params['json.nl'] = 'map';
        $params['fl'] = implode(",", array_merge($defaultProperties, $extraPropertiesAsStrings));
        if ($searchText !== '') {
            $params['hl'] = 'true';
        }
        $params['hl.fl'] = 'smwh_search_field';
        $params['hl.simple-pre'] = '<b>';
        $params['hl.simple-post'] = '</b>';
        $params['hl.fragsize'] = '250';
        $params['searchText'] = $searchText === '' ? '(*)' : $searchText;

        $params['wt'] = 'json';

        $fq = self::encodePropertyFacetValues($propertyFacetConstraints);
        $fq = array_merge($fq, self::encodeCategoryFacets($categoryFacets));
        $fq = array_merge($fq, self::encodeNamespaceFacets($namespaceFacets));
        $params['fq'] = $fq;

        $params['q.alt'] = $searchText === '' ? 'smwh_search_field:(*)' : self::encodeQuery(preg_split("/\s+/", $searchText));

        return $params;
    }

    private function getSortsAndLimits(array $sorts /* @var Sort[] */, $limit, $offset) {
        $params = [];
        $params['rows'] = $limit;
        $params['start'] = $offset;
        $params['sort'] = self::serializeSorts($sorts);
        return $params;
    }

    private static function encodePropertyFacetValues(array $facets/* @var PropertyFacet[] */): array
    {
        $facetValues = [];

        foreach ($facets as $f) {
            /* @var $f PropertyFacet */
            if ($f->type === Datatype::WIKIPAGE) {
                $pAsValue = 'smwh_properties:' . Helper::generateSOLRProperty($f->property, Datatype::WIKIPAGE);
                if (!in_array($pAsValue, $facetValues)) {
                    $facetValues[] = $pAsValue;
                }
                if (!is_null($f->mwTitle)) {
                    $p = Helper::generateSOLRPropertyForSearch($f->property, Datatype::WIKIPAGE);
                    $value = Helper::quoteValue($f->mwTitle->title . '|' . $f->mwTitle->displayTitle, Datatype::WIKIPAGE);
                    $facetValues[] = $p . ':' . $value;
                }
            } else {
                $pAsValue = 'smwh_attributes:' . Helper::generateSOLRProperty($f->property, $f->type);
                if (!in_array($pAsValue, $facetValues)) {
                    $facetValues[] = $pAsValue;
                }
                $p = Helper::generateSOLRPropertyForSearch($f->property, $f->type);
                $value = '';

                if (!is_null($f->range)) {
                    $value = "[".self::encodeRange($f->range, $f->type)."]";
                    $facetValues[] = "$p:$value";
                } else if (!is_null($f->value) && ($f->type === Datatype::STRING || $f->type === Datatype::NUMBER || $f->type === Datatype::BOOLEAN
                        || $f->type === Datatype::DATETIME)) {
                    $value = Helper::quoteValue($f->value, $f->type);
                    $facetValues[] = "$p:$value";
                }
            }
        }
        return $facetValues;
    }

    private static function encodeRange(Range $range, $type): string
    {
        if ($type === Datatype::DATETIME) {
            return Helper::convertDateTimeToLong($range->from) . " TO " . Helper::convertDateTimeToLong($range->to);
        }
        return $range->from . " TO " . $range->to;
    }

    private static function encodeCategoryFacets(array $categories/* @var string[] */): array
    {
        $facetValues = [];
        foreach ($categories as $category) {
            $pAsValue = 'smwh_categories:' . Helper::quoteValue($category, Datatype::WIKIPAGE);
            if (!in_array($pAsValue, $facetValues)) {
                $facetValues[] = $pAsValue;
            }
        }
        return $facetValues;
    }

    private static function encodeNamespaceFacets(array $namespaces/* @var int[] */): array
    {
        $facetValues = [];
        foreach ($namespaces as $namespace) {
            $pAsValue = 'smwh_namespace_id:' . $namespace;
            if (!in_array($pAsValue, $facetValues)) {
                $facetValues[] = $pAsValue;
            }
        }
        return $facetValues;
    }

    private static function serializeSorts(array $sorts): string
    {
        $arr = array_map(function (Sort $s) {
            $order = $s->order === Order::DESC ? 'desc' : 'asc';
            if ($s->property->type === Datatype::INTERNAL) {
                if ($s->property->title === 'score') {
                    return "score $order";
                } else if ($s->property->title === 'displaytitle') {
                    return "smwh_displaytitle $order";
                }
                throw new Exception("unknown special property: {$s->property->title}");
            } else {
                $property = Helper::generateSOLRPropertyForSearch($s->property->title, $s->property->type);
                return "$property $order";
            }
        }, $sorts);

        return implode(", ", $arr);
    }

    private static function encodeQuery(array $terms): string
    {
        $searchTerms = implode(' AND ', $terms);
        $searchTermsWithPlus = implode(' AND ', array_map(fn($e) => "+$e", $terms));

        return "smwh_search_field:(${searchTermsWithPlus}* ) OR "
            . "smwh_search_field:(${searchTerms}) OR "
            . "smwh_title:(${searchTerms}) OR "
            . "smwh_displaytitle:(${searchTerms})";
    }

    private function requestSOLR(array $queryParams)
    {
        try {
            $headerFields = [];
            $headerFields[] = "Content-Type: application/x-www-form-urlencoded; charset=UTF-8";
            $headerFields[] = "Expect:"; // disables 100 CONTINUE
            $ch = curl_init();
            $queryString = self::buildQueryParams($queryParams);
            $url = Helper::getSOLRBaseUrl() . "/select";

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $queryString);
            curl_setopt($ch, CURLOPT_HEADER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headerFields);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
            curl_setopt($ch, CURLOPT_TIMEOUT, 20); //timeout in seconds

            $response = curl_exec($ch);
            if (curl_errno($ch)) {
                $error_msg = curl_error($ch);
                throw new Exception("Error on request: $error_msg");
            }
            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            list($header, $body) = Util::splitResponse($response);
            if ($httpcode >= 200 && $httpcode <= 299) {

                return json_decode($body);

            }
            throw new Exception("Error on select-request. HTTP status: $httpcode. Message: $body");

        } finally {
            curl_close($ch);
        }
    }

    private function requestSOLRExtract($queryString, $contentType)
    {
        try {
            $headerFields = [];
            $headerFields[] = "Content-Type: $contentType";
            $headerFields[] = "Expect:"; // disables 100 CONTINUE
            $ch = curl_init();

            $url = Helper::getSOLRBaseUrl() . "/update/extract?extractOnly=true&wt=json";

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $queryString);
            curl_setopt($ch, CURLOPT_HEADER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headerFields);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
            curl_setopt($ch, CURLOPT_TIMEOUT, 20); //timeout in seconds

            $response = curl_exec($ch);
            if (curl_errno($ch)) {
                $error_msg = curl_error($ch);
                throw new Exception("Error on request: $error_msg");
            }
            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            list($header, $body) = Util::splitResponse($response);
            if ($httpcode >= 200 && $httpcode <= 299) {

                return json_decode($body);

            }
            throw new Exception("Error on select-request. HTTP status: $httpcode. Message: $body");

        } finally {
            curl_close($ch);
        }
    }



    private static function buildQueryParams(array $params) {
        $encodedParams = [];

        foreach($params as $key => $value) {
            if (is_array($value)) {
                $encodedParams = array_merge($encodedParams, array_map(fn($e) => "$key=".urlencode($e), $value));
            } else {
                $encodedParams[] = "$key=".urlencode($value);
            }
        }

        return implode("&", $encodedParams);
    }

}
