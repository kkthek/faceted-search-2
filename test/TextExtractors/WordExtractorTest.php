<?php

namespace DIQA\FacetedSearch2\TextExtractors;

use PHPUnit\Framework\TestCase;

final class WordExtractorTest extends TestCase {

    public function testWordExtraction(): void
    {

        $textExtractor = new WordExtractor();
        $text = $textExtractor->extractDocument('test/data/documents/test-word-document.docx');
        $this->assertStringContainsString('Lorem ipsum', $text);
        $this->assertStringContainsString('"de Finibus Bonorum et Malorum"', $text);

    }


}
