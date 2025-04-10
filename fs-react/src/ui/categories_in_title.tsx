import {Document} from "../common/datatypes";
import React, {useContext} from "react";
import {WikiContext} from "../index";
import ValueSerializer from "../util/value_serializer";
import WikiLink from "./wiki_link";

function CategoriesInTitle(prop: { doc: Document }) {
    let wikiContext = useContext(WikiContext);
    let categoriesInTitle = wikiContext.config['fsg2CategoriesToShowInTitle'];
    let categoryElements = categoriesInTitle
        .filter((c: string) => prop.doc.getCategoryFacetValue(c) != null)
        .map((c: string) => <span><WikiLink page={prop.doc.getCategoryFacetValue(c)}/></span>);

    return <div>{ValueSerializer.join(categoryElements)}</div>;
}

export default CategoriesInTitle;