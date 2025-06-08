import React from "react";
import {Box} from "@mui/material";
import {DocumentQuery, FacetsQuery} from "../common/datatypes";
import Tools from "../util/tools";

function SaveSearchLink(prop: {
    documentQuery: DocumentQuery,
    facetQuery: FacetsQuery
}) {

    let q = Tools.deepClone(prop.documentQuery);
    delete q['extraProperties']; // optimization

    const url = new URL(window.location.href);
    url.searchParams.set('q',  btoa(JSON.stringify(q)));

    return <Box className={'fs-save-search-link'}>
        <a href={url.toString()}>Link to search</a>
    </Box>;
}

export default SaveSearchLink;