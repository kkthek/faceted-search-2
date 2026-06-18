<?php

namespace DIQA\FacetedSearch2\TextExtractors;

use PhpOffice\PhpSpreadsheet\Reader\Exception;
use PHPUnit\Framework\TestCase;

final class XLSExtractorTest extends TestCase {

    /**
     * @throws Exception
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     */
    public function testXLSExtraction(): void
    {

        $textExtractor = new XLSExtractor();
        $text = $textExtractor->extractXlsxText('test/data/documents/test-excel-document.xlsx');
        $this->assertStringContainsString('Lorem ipsum', $text);
        $this->assertStringContainsString('"de Finibus Bonorum et Malorum"', $text);

    }


}
