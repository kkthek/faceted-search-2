<?php

namespace DIQA\FacetedSearch2\TextExtractors;

use DIQA\FacetedSearch2\Update\MWFileReader;
use PhpOffice\PhpSpreadsheet\Exception;
use PHPUnit\Framework\TestCase;

final class PDFExtractorTest extends TestCase {


    /**
     * @throws Exception
     * @throws \PhpOffice\PhpSpreadsheet\Reader\Exception
     */
    public function testPDFExtraction(): void
    {

        $textExtractor = new MWFileReader();
        $metadata=[
            'filePath' => 'test/resources/data/documents/test-pdf-document.pdf',
            'contentType' => 'application/pdf',
        ];
        $text = $textExtractor->extractText($metadata);
        $this->assertStringContainsString('orem ipsum', $text);

    }


}
