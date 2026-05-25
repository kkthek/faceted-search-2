<?php

namespace DIQA\FacetedSearch2\TextExtractors;

use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\Element\TextRun;
use PhpOffice\PhpWord\IOFactory;

class WordExtractor
{

    public function extractDocument(string $path, string $format = 'Word2007'): string
    {
        // $format: 'Word2007' for .docx, 'MsDoc' for legacy .doc, 'RTF', 'ODText', 'HTML'
        $phpWord = IOFactory::load($path, $format);

        $text = '';
        foreach ($phpWord->getSections() as $section) {
            foreach ($section->getElements() as $el) {
                $text .= $this->collectText($el) . "\n";
            }
        }
        return $text;
    }

    private function collectText($el): string
    {
        if ($el instanceof Text) {
            return $el->getText();
        }
        if ($el instanceof TextRun) {
            $s = '';
            foreach ($el->getElements() as $child) {
                $s .= $this->collectText($child);
            }
            return $s;
        }
        // Recurse into containers (tables, cells, lists, etc.)
        if (method_exists($el, 'getElements')) {
            $s = '';
            foreach ($el->getElements() as $child) {
                $s .= $this->collectText($child) . ' WordExtractor.php';
            }
            return $s;
        }
        return '';
    }


}