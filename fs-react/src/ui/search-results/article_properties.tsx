import React, {Suspense, useContext, useRef, useState} from "react";
import {Box, Button} from "@mui/material";
import {BarLoader} from "react-spinners";
import Client from "app/common/client";
import {WikiContext} from "app/index";
import LoadProperties from "app/ui/search-results/load_properties";
import {Document} from "app/common/response/document";

const ArticleProperties = function ArticleProperties(prop: {
    doc: Document,
    client: Client
}) {
    const wikiContext = useContext(WikiContext);
    const showArticleProperties = wikiContext.config['fs2gShowArticleProperties'];
    const articlePropertiesDiv = useRef<HTMLDivElement>(null);
    const [documentPromise, setDocumentPromise] = useState<Promise<Document>>(null);
    if (!showArticleProperties) return;

    function handleExpandClick() {
        const div = articlePropertiesDiv.current;
        const visible = div.checkVisibility();
        div.style.display = visible ? 'none' : 'block';
        if (visible || documentPromise) return;
        const documentByIdPromise = prop.client.getDocumentById(prop.doc.id);
        setDocumentPromise(documentByIdPromise);
    }

    return <Box>
        <Button onClick={handleExpandClick} variant="text" color={"secondary"}>{wikiContext.msg('fs-show-properties')}</Button>
        <Box ref={articlePropertiesDiv} style={{'display':'none'}}>
            <Suspense fallback={<BarLoader/>}>
                <LoadProperties documentPromise={documentPromise} />
            </Suspense>
        </Box>
    </Box>;
};

export default ArticleProperties;