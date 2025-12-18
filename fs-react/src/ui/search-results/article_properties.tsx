import React, {Suspense, useContext, useRef, useState} from "react";
import {WikiContext} from "../../index";
import Client from "../../common/client";
import {Box, Button} from "@mui/material";
import {Document} from "../../common/response/document";
import {BarLoader} from "react-spinners";
import LoadProperties from "./load_properties";

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