<?php
namespace DIQA\FacetedSearch2\SolrClient;


use DIQA\FacetedSearch2\ConfigTools;
use DIQA\FacetedSearch2\Model\Common\MWTitle;
use DIQA\FacetedSearch2\Model\Common\Property;
use DIQA\FacetedSearch2\Model\Common\Range;
use DIQA\FacetedSearch2\Model\Common\Datatype;
use DIQA\FacetedSearch2\Model\Request\DocumentQuery;
use DIQA\FacetedSearch2\Model\Request\FacetValue;
use DIQA\FacetedSearch2\Model\Request\PropertyFacet;
use DIQA\FacetedSearch2\Setup;

final class DocumentQueryTest extends BaseTest {

    private SolrRequestClient $client;

    protected function setUp(): void
    {
       parent::setUp();

       $this->client = ConfigTools::getFacetedSearchClient();
       $documentUpdater = ConfigTools::getFacetedSearchUpdateClient();
       $documentUpdater->clearAllDocuments();
       $documentUpdater->updateDocument(TestData::generateData());
    }

    public function testStringPropertyConstraint(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet(new Property('Has name', Datatype::STRING));
        $p->setValues([FacetValue::fromValue('Markus')]);

        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testStringPropertyORConstraint(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet(new Property('Has name', Datatype::STRING));
        $p->setValues([FacetValue::fromValue('Markus'), FacetValue::fromValue('Dieter')]);

        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testStringPropertyConstraintEmpty(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet(new Property('Has name', Datatype::STRING));
        $p->setValues([FacetValue::allValues()]);
        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testPropertyFacetNumberRange(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet(new Property('Has age', Datatype::NUMBER));
        $p->setValues([FacetValue::fromRange(new Range(40, 60))]);

        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testPropertyFacetNumberRangeEmpty(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet(new Property('Has age', Datatype::NUMBER));
        $p->setValues([FacetValue::fromRange(new Range(80, 90))]);
        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(0, count($response->docs));
    }

    public function testPropertyFacetDateTimeRange(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet(new Property('Was born at', Datatype::DATETIME));
        $p->setValues([FacetValue::fromRange(new Range('1969-01-01T00:00:00Z', '1970-01-01T00:00:00Z'))]);

        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testPropertyFacetDateTimeRangeEmpty(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet(new Property('Was born at', Datatype::DATETIME));
        $p->setValues([FacetValue::fromRange(new Range('1970-01-01T00:00:00Z', '1971-01-01T00:00:00Z'))]);
        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(0, count($response->docs));
    }

    public function testPropertyFacetBoolean(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet(new Property('Is on pension', Datatype::BOOLEAN));
        $p->setValues([FacetValue::fromValue('false')]);
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
        $p = new PropertyFacet(new Property('Works at', Datatype::WIKIPAGE));
        $p->setValues([FacetValue::fromTitle(new MWTitle('DIQA-GmbH', 'DIQA'))]);

        $q->setSearchText('')
            ->setPropertyFacets([$p]);
        $response = $this->client->requestDocuments($q);

        $this->assertEquals(1, count($response->docs));
    }

    public function testPropertyFacetWikiPageEmpty(): void
    {
        $q = new DocumentQuery();
        $p = new PropertyFacet(new Property('Works at', Datatype::WIKIPAGE));
        $p->setValues([FacetValue::allValues()]);
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