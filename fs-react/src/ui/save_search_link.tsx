import React, {useContext} from "react";
import {Box} from "@mui/material";
import {DocumentQuery} from "../common/datatypes";
import Tools from "../util/tools";
import {WikiContext} from "../index";

function SaveSearchLink(prop: {
    documentQuery: DocumentQuery
}) {
    const wikiContext = useContext(WikiContext);
    const q = Tools.deepClone(prop.documentQuery);
    delete q['extraProperties']; // optimization

    const url = new URL(window.location.href);
    url.searchParams.set('q',  btoa(JSON.stringify(q)));

    return <Box className={'fs-save-search-link'}>
        <a href={url.toString()}>{wikiContext.msg('fs-link-to-search')}</a>
    </Box>;
}

export default SaveSearchLink;