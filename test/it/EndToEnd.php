<?php
namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\SolrClient\SolrUpdateClient;
use DIQA\FacetedSearch2\SolrClient\TestData;
use DIQA\FacetedSearch2\SolrClient\Util;
use Exception;
use PHPUnit\Framework\TestCase;

final class EndToEnd extends TestCase {

    protected function setUp(): void
    {
        $documentUpdater = new SolrUpdateClient();
        $documentUpdater->clearAllDocuments();
        $documentUpdater->updateDocument(TestData::generateData());
    }

    public function testDocumentQuery(): void
    {
       $body = <<<BODY
{
    "searchText": "DIQA"
}
BODY;

        $response = $this->requestProxy($body, "documents");
        $this->assertEquals(
            1,$response->numResults
        );
    }

    public function testStatsQuery(): void
    {
        $body = <<<BODY
{
    "statsProperties": [{
        "property": "Was born at",
        "type": 2
    }]
}
BODY;

        $response = $this->requestProxy($body, "stats");
        $this->assertEquals(
            1, count($response->stats)
        );
    }

    function requestProxy(string $json, $endpoint)
    {
        try {
            $headerFields = [];
            $headerFields[] = "Content-Type: application/x-www-form-urlencoded; charset=UTF-8";
            $headerFields[] = "Expect:"; // disables 100 CONTINUE
            $ch = curl_init();

            $url = "http://localhost/mediawiki/rest.php/FacetedSearch2/v1/proxy/$endpoint";

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
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
            throw new Exception("Error on upload. HTTP status: $httpcode. Message: $body");

        } finally {
            curl_close($ch);
        }
    }

}