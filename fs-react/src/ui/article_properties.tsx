import React, {useContext, useRef} from "react";
import {WikiContext} from "../index";
import {Document, PropertyFacetValues} from "../common/datatypes";
import WikiLink from "./wiki_link";
import ValueSerializer from "../util/value_serializer";

function ArticleProperties(prop: {doc: Document}) {
    let wikiContext = useContext(WikiContext);
    let showArticleProperties = wikiContext.config['fsg2ShowArticleProperties'];
    if (!showArticleProperties) return;
    let articlePropertiesDiv = useRef<any>(null);

    function handleExpandClick() {
        const div = articlePropertiesDiv.current;
        div.style.display = div.checkVisibility() ? 'none' : 'block';
    }

    const rows = prop.doc.propertyFacets.map((pfv) => {
        return <Row key={'article-properties-'+prop.doc.id+pfv.property.title} pfv={pfv}/>
    });
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