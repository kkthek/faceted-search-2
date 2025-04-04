<?php

namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\SolrClient\SolrRequestClient;
use DIQA\FacetedSearch2\SolrClient\SolrUpdateClient;
use DIQA\FacetedSearch2\Utils\WikiTools;
use OutputPage;
use Skin;
use RequestContext;
use SMWDIProperty;
use DataTypeRegistry;

class Setup
{

    public static function initModules()
    {

        global $wgResourceModules;
        global $IP;

        $basePath = "$IP/extensions/FacetedSearch2";
        if (file_exists("$basePath/fs-react/public/main.js")) {
            $reactScript = "fs-react/public/main.js";
        } else {
            trigger_error("No compiled react script found");
            die();
        }

        $wgResourceModules['ext.diqa.facetedsearch2'] = array(
            'localBasePath' => $basePath,
            'remoteExtPath' => 'FacetedSearch2',
            'position' => 'bottom',
            'messages' => [
                'score_desc',
                '_mdat_desc',
                '_mdat_asc',
                'displaytitle_desc',
                'displaytitle_asc'
            ],
            'scripts' => [
                $reactScript,
            ],
            'styles' => ['fs-react/public/skins/main.css'],
            'dependencies' => [],
        );

    }

    public static function getFacetedSearchClient(): FacetedSearchClient
    {
        global $fsgBackendQueryClient;
        if (!isset($fsgBackendQueryClient)) {
            $fsgBackendQueryClient = SolrRequestClient::class;
        }
        return new $fsgBackendQueryClient;
    }

    public static function getFacetedSearchUpdateClient(): FacetedSearchUpdateClient
    {
        global $fsgBackendUpdateClient;
        if (!isset($fsgBackendUpdateClient)) {
            $fsgBackendUpdateClient = SolrUpdateClient::class;
        }
        return new $fsgBackendUpdateClient;
    }

    public static function setupFacetedSearch() {

        // TODO: register update hooks
    }

    public static function initializeBeforeParserInit() {
        if( !RequestContext::getMain()->hasTitle() ) {
            return true;
        }

        $currentTitle = RequestContext::getMain()->getTitle();
        if( is_null($currentTitle) ||
            $currentTitle->getNamespace() != NS_SPECIAL ||
            ($currentTitle->getText() != 'FacetedSearch2') ) {
            return true;
        }


        global $fsgFacetValueLimit, $fsgExtraPropertiesToRequest, $fsgAnnotationsInSnippet;

        $jsVars = [];
        $jsVars["fsgFacetValueLimit"] = $fsgFacetValueLimit;
        $jsVars["fsgAnnotationsInSnippet"] = $fsgAnnotationsInSnippet;
        $fsgExtraPropertiesToRequest = self::calculateProperties($fsgAnnotationsInSnippet);
        $jsVars["fsgExtraPropertiesToRequest"] = $fsgExtraPropertiesToRequest;

        RequestContext::getMain()->getOutput()->addJsConfigVars($jsVars);

        return true;
    }

    public static function onBeforePageDisplay(OutputPage $out, Skin $skin)
    {

        if (!is_null($out->getTitle()) && $out->getTitle()->isSpecial("FacetedSearch2")) {
            self::checkIfCompiled();
            $out->addModules('ext.diqa.facetedsearch2');
        }
    }

    private static function checkIfCompiled(): void
    {
        global $IP;
        if (!file_exists("$IP/extensions/FacetedSearch2/fs-react/public/main.js")) {
            trigger_error("You need to build FacetedSearch2. See README");
            die();
        }
    }

    private static function calculateProperties($fsgAnnotationsInSnippet)
    {
        $result = [];
        $allExtraProperties = WikiTools::flatten(array_values($fsgAnnotationsInSnippet));
        foreach($allExtraProperties as $property) {
            $smwProperty = SMWDIProperty::newFromUserLabel($property);
            $typeId = $smwProperty->findPropertyValueType();
            $type = DataTypeRegistry::getInstance()->getDataItemByType($typeId);

            // The property names of all attributes are built based on their type.
            switch($type) {
                case SMWDataItem::TYPE_BOOLEAN:
                    $result[] = new Property($property, Datatype::BOOLEAN);
                    break;
                case SMWDataItem::TYPE_NUMBER:
                    $result[] =  new Property($property, Datatype::NUMBER);
                    break;
                case SMWDataItem::TYPE_BLOB:
                    $result[] =  new Property($property, Datatype::STRING);
                    break;
                case SMWDataItem::TYPE_WIKIPAGE:
                    $result[] =  new Property($property, Datatype::WIKIPAGE);
                    break;
                case SMWDataItem::TYPE_TIME:
                    $result[] =  new Property($property, Datatype::DATETIME);
                    break;
            }
        }
        return $result;
    }


}