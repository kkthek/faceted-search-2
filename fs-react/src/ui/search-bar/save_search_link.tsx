import React, {useContext} from "react";
import {Box, Link} from "@mui/material";
import {WikiContext} from "../../index";
import ObjectTools from "../../util/object_tools";
import {DocumentQuery} from "../../common/request/document_query";

function SaveSearchLink(prop: {
    documentQuery: DocumentQuery
}) {
    const wikiContext = useContext(WikiContext);
    const q = ObjectTools.deepClone(prop.documentQuery);
    delete q['extraProperties']; // optimization

    const url = new URL(window.location.href);
    url.searchParams.set('q',  btoa(JSON.stringify(q)));

    const copyLinkToClipboard = function (event: React.MouseEvent<HTMLElement>) {

        navigator.clipboard.writeText(url.toString()).then(() => {
            const browserWindow = window as any;
            browserWindow.mw?.notify(wikiContext.msg('fs-copy-search-link'));
        });
        event.preventDefault();
    }

    return <Box className={'fs-save-search-link'}
        >
        <Link href={url.toString()}
              onClick={copyLinkToClipboard}
        >{wikiContext.msg('fs-link-to-search')}</Link>
    </Box>;
}

export default SaveSearchLink;