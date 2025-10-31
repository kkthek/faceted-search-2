import React, {ReactElement, useContext, useRef, useState} from "react";
import {WikiContext} from "../../index";
import {Document, PropertyFacetValues} from "../../common/datatypes";
import WikiLink from "../common/wiki_link";
import ValueSerializer from "../../util/value_serializer";
import Client from "../../common/client";
import {Button, Table, TableBody, TableCell, TableRow} from "@mui/material";

const ArticleProperties = function ArticleProperties(prop: {
    doc: Document,
    client: Client
}) {
    const wikiContext = useContext(WikiContext);
    const showArticleProperties = wikiContext.config['fs2gShowArticleProperties'];
    if (!showArticleProperties) return;
    const articlePropertiesDiv = useRef<any>(null);
    const [document, setDocument] = useState((): Document => null);

    async function handleExpandClick() {
        const div = articlePropertiesDiv.current;
        const visible = div.checkVisibility();
        div.style.display = visible ? 'none' : 'block';
        if (visible || document !== null) return;
        const doc = await prop.client.getDocumentById(prop.doc.id);
        setDocument(doc);
    }

    let rows: ReactElement[] = [];
    if (document !== null) {
        rows = document.propertyFacets
            .sort((a, b) => a.property.title.localeCompare(b.property.title))
            .map((pfv) => {
            return <Row key={'article-properties-'+prop.doc.id+pfv.property.title} pfv={pfv}/>
        });
    }

    return <div>
        <Button onClick={handleExpandClick} variant="text">{wikiContext.msg('fs-show-properties')}</Button>
        <div ref={articlePropertiesDiv} style={{'display':'none'}}>
            <Table size="small" aria-label="simple table">
                <TableBody>{rows}</TableBody>
            </Table>
        </div>
    </div>;
};

function Row(prop: {pfv: PropertyFacetValues}) {
    return <TableRow>
        <TableCell><WikiLink page={prop.pfv.property}/></TableCell>
        <TableCell>{ValueSerializer.getValues(prop.pfv)}</TableCell>
    </TableRow>
}

export default ArticleProperties;