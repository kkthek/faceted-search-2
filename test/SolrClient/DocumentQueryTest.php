<?php
namespace DIQA\FacetedSearch2\SolrClient;

use DIQA\FacetedSearch2\Model\Common\MWTitle;
use DIQA\FacetedSearch2\Model\Common\Range;
use DIQA\FacetedSearch2\Model\Request\Datatype;
use DIQA\FacetedSearch2\Model\Request\DocumentQuery;
use DIQA\FacetedSearch2\Model\Request\PropertyFacet;
use PHPUnit\Framework\TestCase;

final class SolrClientTest extends TestCase {

    private Client $client;

    protected function setUp(): void
    {
       $this->client = new Client();
       $documentUpdater = new DocumentUpdater();
       $documentUpdater->clearCore();
       $documentUpdater->updateDocument(TestData::generateData());
    }

    public function testStringPropertyConstraint(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet('Has name', Datatype::STRING);
        $p->setValue('Michael');

        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testPropertyFacetNumberRange(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet('Has age', Datatype::NUMBER);
        $p->setRange(new Range(40, 60));
        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testPropertyFacetNumberRangeEmpty(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet('Has age', Datatype::NUMBER);
        $p->setRange(new Range(80, 90));
        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(0, count($response->docs));
    }

    public function testPropertyFacetDateTimeRange(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet('Was born at', Datatype::DATETIME);
        $p->setRange(new Range('1969-01-01T00:00:00Z', '1970-01-01T00:00:00Z'));
        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testPropertyFacetDateTimeRangeEmpty(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet('Was born at', Datatype::DATETIME);
        $p->setRange(new Range('1970-01-01T00:00:00Z', '1971-01-01T00:00:00Z'));
        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(0, count($response->docs));
    }

    public function testPropertyFacetBoolean(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet('Is on pension', Datatype::BOOLEAN);
        $p->setValue('false');
        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testFulltext(): void
    {
        $q = new DocumentQuery();
        $q->setSearchText('DIQA');
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testPropertyFacetWikiPage(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet('Works at', Datatype::WIKIPAGE);
        $p->setMwTitle(new MWTitle('DIQA-GmbH', 'DIQA'));
        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testCategoryFacet(): void
    {
        $q = new DocumentQuery();
        $q->setSearchText('')
            ->setCategoryFacets(["Employee"]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testNamespaceFacet(): void
    {
        $q = new DocumentQuery();
        $q->setSearchText('')
            ->setNamespaceFacets([0]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

}