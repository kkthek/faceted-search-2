<?php
namespace DIQA\FacetedSearch2;

use PHPUnit\Framework\TestCase;

final class EndToEnd extends TestCase {

    public function test1(): void
    {
       $body = <<<BODY
{
    "searchText": "test"
}
BODY;

        $response = $this->requestProxy($body);
        $this->assertEquals(
            176,$response->numResults
        );
    }

    function requestProxy(string $json)
    {
        try {
            $headerFields = [];
            $headerFields[] = "Content-Type: application/x-www-form-urlencoded; charset=UTF-8";
            $headerFields[] = "Expect:"; // disables 100 CONTINUE
            $ch = curl_init();

            $url = "http://localhost/mediawiki/rest.php/FacetedSearch2/v1/proxy/documents";

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

            list($header, $body) = self::splitResponse($response);
            if ($httpcode >= 200 && $httpcode <= 299) {

                return json_decode($body);

            }
            throw new Exception("Error on upload. HTTP status: $httpcode. Message: $body");

        } finally {
            curl_close($ch);
        }
    }

    private static function splitResponse($res): array
    {
        $bodyBegin = strpos($res, "\r\n\r\n");
        list($header, $res) = $bodyBegin !== false ? array(substr($res, 0, $bodyBegin), substr($res, $bodyBegin + 4)) : array($res, "");
        return array($header, str_replace("%0A%0D%0A%0D", "\r\n\r\n", $res));
    }

}