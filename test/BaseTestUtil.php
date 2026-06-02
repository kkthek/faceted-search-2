<?php

namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\ConfigTools;
use DIQA\FacetedSearch2\SolrClient\TestData;

class BaseTestUtil {

    public static function recreateIndexIfExists(): void
    {
        $updateClient = ConfigTools::getFacetedSearchUpdateClient();
        if ($updateClient->existsIndex()) {
            $updateClient->deleteIndex();
        }
        $updateClient->initIndex();
    }

    public static function clearIndex(): void
    {
        $updateClient = ConfigTools::getFacetedSearchUpdateClient();

        $updateClient->clearAllDocuments();
        $updateClient->refreshIndex();
        $updateClient->updateDocuments(TestData::generateData());
        $updateClient->refreshIndex();
    }

}