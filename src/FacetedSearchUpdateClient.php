<?php

namespace DIQA\FacetedSearch2;

use DIQA\FacetedSearch2\Model\Update\Document;

interface FacetedSearchUpdateClient
{
    /**
     * Creates/Updates a wiki page (=Document) in the index.
     *
     * @param Document $doc
     * @return mixed result ignored for now
     */
    public function updateDocument(Document $doc);

    /**
     * Clears ALL documents from the index.
     *
     * @return mixed result ignored for now
     */
    public function clearAllDocuments();

}