import React, {ReactElement, useContext, useRef, useState} from "react";
import {WikiContext} from "../index";
import {Document, PropertyFacetValues} from "../common/datatypes";
import WikiLink from "./wiki_link";
import ValueSerializer from "../util/value_serializer";
import {SearchStateDocument} from "./event_handler";
import Client from "../common/client";

function ArticleProperties(prop: {
    doc: Document,
    client: Client
}) {
    let wikiContext = useContext(WikiContext);
    let showArticleProperties = wikiContext.config['fsg2ShowArticleProperties'];
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
        <span onClick={() => handleExpandClick()}>Show properties...</span>
        <div ref={articlePropertiesDiv} hidden={true}><table><tbody>{rows}</tbody></table></div>
    </div>;
}

function Row(prop: {pfv: PropertyFacetValues}) {
    return <tr>
        <td><WikiLink page={prop.pfv.property}/></td>
        <td>{ValueSerializer.getValues(prop.pfv)}</td>
    </tr>
}

export default ArticleProperties;