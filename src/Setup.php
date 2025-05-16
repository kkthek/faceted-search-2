<?php

namespace DIQA\FacetedSearch2;

use SMW\DataTypeRegistry;
use SMWDataItem;
use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\SolrClient\SolrRequestClient;
use DIQA\FacetedSearch2\SolrClient\SolrUpdateClient;
use DIQA\FacetedSearch2\Utils\ArrayTools;
use OutputPage;
use RequestContext;
use Skin;
use SMWDIProperty;

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

    private static function getMessageKeys() {
        $keys = [];
        $messages = json_decode(file_get_contents('../i18n/en.json'));
        foreach($messages as $key => $value) {
            $keys[] = $key;
        }
        return $keys;
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

        define('FS2_EXTENSION_VERSION', true);

        global $fs2gFacetedSearchForMW;
        if (!$fs2gFacetedSearchForMW) {
            global $wgSpecialPages;
            unset($wgSpecialPages['Search']);
        }

        global $fs2gEnableIncrementalIndexer;

        if ($fs2gEnableIncrementalIndexer) {
            global $wgHooks;
            $wgHooks['SMW::SQLStore::AfterDataUpdateComplete'][] = 'DIQA\FacetedSearch2\Update\FSIncrementalUpdater::onUpdateDataAfter';
            $wgHooks['UploadComplete'][] = 'DIQA\FacetedSearch2\Update\FSIncrementalUpdater::onUploadComplete';
            $wgHooks['AfterImportPage'][] = 'DIQA\FacetedSearch2\Update\FSIncrementalUpdater::onAfterImportPage';
            $wgHooks['PageMoveCompleting'][] = 'DIQA\FacetedSearch2\Update\FSIncrementalUpdater::onTitleMoveComplete';
            $wgHooks['PageDelete'][] = 'DIQA\FacetedSearch2\Update\FSIncrementalUpdater::onPageDelete';
            $wgHooks['ApprovedRevsRevisionApproved'][] = 'DIQA\FacetedSearch2\Update\FSIncrementalUpdater::onRevisionApproved';
            $wgHooks['PageSaveComplete'][] = 'DIQA\FacetedSearch2\Update\FSIncrementalUpdater::onPageSaveComplete';
        }
    }

    public static function initializeBeforeParserInit() {
        if( !RequestContext::getMain()->hasTitle() ) {
            return true;
        }

        $currentTitle = RequestContext::getMain()->getTitle();
        $requestUrl = RequestContext::getMain()->getRequest()->getRequestURL();
        $isFacetedSearch2Page = !is_null($currentTitle)
            && $currentTitle->getNamespace() === NS_SPECIAL
            && ($currentTitle->getText() === 'FacetedSearch2' || $currentTitle->getText() === 'Search');
        $isProxyEndpoint = strpos($requestUrl, '/FacetedSearch2/v1/proxy') > -1;
        if( !$isFacetedSearch2Page && !$isProxyEndpoint) {
            return true;
        }

        global $fsgFacetValueLimit,
               $fs2gExtraPropertiesToRequest,
               $fs2gAnnotationsInSnippet,
               $fs2gCategoriesToShowInTitle,
               $fs2gDefaultSortOrder,
               $fs2gCategoryFilter,
               $fs2gHitsPerPage,
               $fs2gPlaceholderText,
               $fs2gShowCategories,
               $fs2gShowSortOrder,
               $fs2gShowNamespaces,
               $fs2gShowArticleProperties,
               $fs2gShownFacets,
               $fs2gShownCategoryFacets,
               $fs2gPromotionProperty,
               $fs2gDemotionProperty,
               $fs2gFacetsWithOR,
               $fs2gShowSolrScore,
               $fs2gCreateNewPageLink,
               $fs2gShowFileInOverlay,
               $fs2gNamespacesToShow
               ;

        $jsVars = [];
        $jsVars["fs2gFacetValueLimit"] = $fsgFacetValueLimit;
        $jsVars["fs2gAnnotationsInSnippet"] = $fs2gAnnotationsInSnippet;
        $fs2gExtraPropertiesToRequest = self::getPropertiesForAnnotations($fs2gAnnotationsInSnippet);
        $jsVars["fs2gExtraPropertiesToRequest"] = $fs2gExtraPropertiesToRequest;
        $jsVars["fs2gCategoriesToShowInTitle"] = $fs2gCategoriesToShowInTitle;
        $jsVars["fs2gDefaultSortOrder"] = $fs2gDefaultSortOrder;
        $jsVars["fs2gCategoryFilter"] = $fs2gCategoryFilter;
        $jsVars["fs2gHitsPerPage"] = $fs2gHitsPerPage;
        $jsVars["fs2gPlaceholderText"] = $fs2gPlaceholderText;
        $jsVars["fs2gShowCategories"] = $fs2gShowCategories;
        $jsVars["fs2gShowSortOrder"] = $fs2gShowSortOrder;
        $jsVars["fs2gShowNamespaces"] = $fs2gShowNamespaces;
        $jsVars["fs2gNamespacesToShow"] = $fs2gNamespacesToShow;
        $jsVars["fs2gShowArticleProperties"] = $fs2gShowArticleProperties;
        $jsVars["fs2gShownFacets"] = $fs2gShownFacets;
        $jsVars["fs2gShownCategoryFacets"] = $fs2gShownCategoryFacets;
        $jsVars["fs2gPromotionProperty"] = $fs2gPromotionProperty;
        if ($fs2gPromotionProperty !== false) {
            $fs2gExtraPropertiesToRequest[] = new Property($fs2gPromotionProperty, Datatype::BOOLEAN);
        }
        $jsVars["fs2gDemotionProperty"] = $fs2gDemotionProperty;
        if ($fs2gDemotionProperty !== false) {
            $fs2gExtraPropertiesToRequest[] = new Property($fs2gDemotionProperty, Datatype::BOOLEAN);
        }
        $jsVars["fs2gFacetsWithOR"] = $fs2gFacetsWithOR;
        $jsVars["fs2gShowSolrScore"] = $fs2gShowSolrScore;
        $jsVars["fs2gCreateNewPageLink"] = $fs2gCreateNewPageLink;
        $jsVars["fs2gShowFileInOverlay"] = $fs2gShowFileInOverlay;
        if ($fs2gShowFileInOverlay !== false) {
            $fs2gExtraPropertiesToRequest[] = new Property("diqa import fullpath", Datatype::STRING);
        }

        RequestContext::getMain()->getOutput()->addJsConfigVars($jsVars);

        return true;
    }

    public static function onBeforePageDisplay(OutputPage $out, Skin $skin)
    {

        if (!is_null($out->getTitle())
            && ($out->getTitle()->isSpecial("FacetedSearch2") || $out->getTitle()->isSpecial("Search"))) {
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

    private static function getPropertiesForAnnotations($fs2gAnnotationsInSnippet)
    {
        //FIXME: store in MW-object cache
        $result = [];
        $allExtraProperties = ArrayTools::flatten(array_values($fs2gAnnotationsInSnippet));
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