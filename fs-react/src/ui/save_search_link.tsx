import React from "react";
import {Box} from "@mui/material";
import {DocumentQuery, FacetsQuery} from "../common/datatypes";

function SaveSearchLink(prop: {
    documentQuery: DocumentQuery,
    facetQuery: FacetsQuery
}) {

    const url = new URL(window.location.href);
    url.searchParams.set('dq',  JSON.stringify(prop.documentQuery));
    url.searchParams.set('fq', JSON.stringify(prop.facetQuery));

    return <Box className={'fs-save-search-link'}>
        <a href={url.toString()}>Link to search</a>
    </Box>;
}

export default SaveSearchLink;