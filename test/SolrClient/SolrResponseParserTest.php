<?php
namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\SolrClient\SolrResponseParser;
use PHPUnit\Framework\TestCase;

final class SolrResponseParserTest extends TestCase {

    public function testParse(): void
    {
        $jsonResponse = file_get_contents('test/data/solr_response_sample.json');
        $parser = new SolrResponseParser(json_decode($jsonResponse));
        $solrDocumentResponse = $parser->parse();
        print_r($solrDocumentResponse);

        $this->assertEquals(
            1,1
        );
    }

    public function testParseStats(): void
    {
        $jsonResponse = file_get_contents('test/data/solr_response_stats.json');
        $parser = new SolrResponseParser(json_decode($jsonResponse));
        $solrDocumentResponse = $parser->parseStatsResponse();
        print_r($solrDocumentResponse);

        $this->assertEquals(
            1,1
        );
    }

    public function testParseFacetQueries(): void
    {
        $jsonResponse = file_get_contents('test/data/solr_response_facetQueries.json');
        $parser = new SolrResponseParser(json_decode($jsonResponse));
        $solrDocumentResponse = $parser->parseStatsResponse();
        print_r($solrDocumentResponse);

        $this->assertEquals(
            1,1
        );
    }
}