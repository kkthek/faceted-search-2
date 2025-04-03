<?php

namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\Model\Request\DocumentQuery;
use DIQA\FacetedSearch2\Model\Request\FacetQuery;
use DIQA\FacetedSearch2\Model\Request\StatsQuery;
use DIQA\FacetedSearch2\Model\Response\SolrDocumentsResponse;
use DIQA\FacetedSearch2\Model\Response\SolrFacetResponse;
use DIQA\FacetedSearch2\Model\Response\SolrStatsResponse;

interface FacetedSearchClient
{
    /**
     * Requests a set of documents.
     *
     * @param DocumentQuery $q
     * @return SolrDocumentsResponse
     */
    public function requestDocuments(DocumentQuery $q): SolrDocumentsResponse;

    /**
     * Requests a set of facets, ie. a list of properties with values and their frequency.
     *
     * @param FacetQuery $q
     * @return SolrFacetResponse
     */
    public function requestFacets(FacetQuery $q): SolrFacetResponse;

    /**
     * Requests statistical data about a property, ie. min/max values. Generates and returns
     * pre-calculated clusters from this data.
     * @param StatsQuery $q
     * @return SolrStatsResponse
     */
    public function requestStats(StatsQuery $q): SolrStatsResponse;

    /**
     * Extracts fulltext from a file.
     *
     * @param string $fileContent The raw content of the file
     * @param string $contentType The content media type (eg. application/pdf)
     * @return string The extracted full-text
     */
    public function requestFileExtraction(string $fileContent, string $contentType): string;
}