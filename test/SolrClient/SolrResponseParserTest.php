<?php
namespace DIQA\FacetedSearch2\SolrClient;

use PHPUnit\Framework\TestCase;

final class SolrResponseParserTest extends TestCase {

    public function testParse(): void
    {
        $jsonResponse = file_get_contents('test/data/solr_response_sample.json');
        $parser = new SolrResponseParser(json_decode($jsonResponse));
        $solrDocumentResponse = $parser->parse();
        $this->assertEquals(864,$solrDocumentResponse->getNumResults());
        // ADD more assertions
    }

    public function testParseStats(): void
    {
        $jsonResponse = file_get_contents('test/data/solr_response_stats.json');
        $parser = new SolrResponseParser(json_decode($jsonResponse));
        $solrDocumentResponse = $parser->parseStatsResponse();

        $this->assertEquals(0,$solrDocumentResponse->getStats()[0]->getMin());
        $this->assertEquals(114,$solrDocumentResponse->getStats()[0]->getMax());
        $this->assertEquals(16,$solrDocumentResponse->getStats()[0]->getCount());
    }

    public function testParseFacetQueries(): void
    {
        $jsonResponse = file_get_contents('test/data/solr_response_facetQueries.json');
        $parser = new SolrResponseParser(json_decode($jsonResponse));
        $solrDocumentResponse = $parser->parseStatsResponse();

        $this->assertEquals(2, count($solrDocumentResponse->getRangeValueCounts()));
        $this->assertEquals(1, $solrDocumentResponse->getRangeValueCounts()[0]->getRange()->getFrom());
        $this->assertEquals(5, $solrDocumentResponse->getRangeValueCounts()[0]->getRange()->getTo());
        $this->assertEquals(4, $solrDocumentResponse->getRangeValueCounts()[0]->getCount());
        $this->assertEquals(5, $solrDocumentResponse->getRangeValueCounts()[1]->getRange()->getFrom());
        $this->assertEquals(11, $solrDocumentResponse->getRangeValueCounts()[1]->getRange()->getTo());
        $this->assertEquals(7, $solrDocumentResponse->getRangeValueCounts()[1]->getCount());
    }
}