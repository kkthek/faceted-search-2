import React, {useContext} from "react";
import {Document} from "app/common/response/document";
import {WikiContext} from "app/index";
import Span from "app/custom_ui/span";
import WikiLink from "app/ui/common/wiki_link";
import ValueSerializer from "app/util/value_serializer";

function CategoriesInTitle(prop: { doc: Document }) {
    const wikiContext = useContext(WikiContext);
    const categoriesInTitle = wikiContext.config['fs2gCategoriesToShowInTitle'];
    if (categoriesInTitle.length === 0) {
        return;
    }
    const categoryElements = categoriesInTitle
        .filter((c: string) => prop.doc.getCategoryFacetValue(c) != null)
        .map((c: string) => <Span><WikiLink page={prop.doc.getCategoryFacetValue(c)}/></Span>);

    if (categoryElements.length === 0 ) {
        return;
    }
    return <Span sx={{'margin-left': '10px;'}}>[{ValueSerializer.join(categoryElements)}]</Span>
}

export default CategoriesInTitle;