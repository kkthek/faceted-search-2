<?php

namespace DIQA\FacetedSearch2\TextExtractors;

use PHPUnit\Framework\TestCase;

final class PowerPointExtractorTest extends TestCase {


    public function testPowerPointExtraction(): void
    {

        $textExtractor = new PPTExtractor();
        $text = $textExtractor->extractPptxTextViaLib('test/data/documents/test-powerpoint-document.pptx');
        $this->assertStringContainsString('Lorem Ipsum', $text);
        $this->assertStringContainsString('"de Finibus Bonorum et Malorum"', $text);

    }


}
