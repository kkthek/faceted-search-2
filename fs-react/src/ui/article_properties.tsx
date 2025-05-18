import React, {ReactElement, useContext, useRef, useState} from "react";
import {WikiContext} from "../index";
import {Document, PropertyFacetValues} from "../common/datatypes";
import WikiLink from "./wiki_link";
import ValueSerializer from "../util/value_serializer";
import Client from "../common/client";
import {Button, Table, TableBody, TableCell, TableRow} from "@mui/material";

function ArticleProperties(prop: {
    doc: Document,
    client: Client
}) {
    let wikiContext = useContext(WikiContext);
    let showArticleProperties = wikiContext.config['fs2gShowArticleProperties'];
    if (!showArticleProperties) return;
    let articlePropertiesDiv = useRef<any>(null);
    const [documentById, setDocumentById] = useState((): Document => null);

    function handleExpandClick() {
        const div = articlePropertiesDiv.current;
        div.style.display = div.checkVisibility() ? 'none' : 'block';
        prop.client.getDocumentById(prop.doc.id).then((document) => {
            setDocumentById(document);
        })
    }

    let rows: ReactElement[] = [];
    if (documentById !== null) {
        rows = documentById.propertyFacets.map((pfv) => {
            return <Row key={'article-properties-'+prop.doc.id+pfv.property.title} pfv={pfv}/>
        });
    }

    return <div>
        <Button onClick={() => handleExpandClick()} variant="text">{wikiContext.msg('fs-show-properties')}</Button>
        <div ref={articlePropertiesDiv} style={{'display':'none'}}>
            <Table size="small" aria-label="simple table">
                <TableBody>{rows}</TableBody>
            </Table>
        </div>
    </div>;
}

function Row(prop: {pfv: PropertyFacetValues}) {
    return <TableRow>
        <TableCell><WikiLink page={prop.pfv.property}/></TableCell>
        <TableCell>{ValueSerializer.getValues(prop.pfv)}</TableCell>
    </TableRow>
}

export default ArticleProperties;