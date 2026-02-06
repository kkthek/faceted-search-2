import React, {useContext} from "react";
import {WikiContext} from "../../index";
import ValueSerializer from "../../util/value_serializer";
import WikiLink from "../common/wiki_link";
import {Typography} from "@mui/material";
import {Document} from "../../common/response/document";
import Span from "../../custom_ui/span";

function CategoriesInTitle(prop: { doc: Document }) {
    const wikiContext = useContext(WikiContext);
    const categoriesInTitle = wikiContext.config['fs2gCategoriesToShowInTitle'];
    if (categoriesInTitle.length === 0) {
        return;
    }
    const categoryElements = categoriesInTitle
        .filter((c: string) => prop.doc.getCategoryFacetValue(c) != null)
        .map((c: string) => <Span><WikiLink page={prop.doc.getCategoryFacetValue(c)}/></Span>);

    return <Typography>{wikiContext.msg('fs-is-in-category')}: {ValueSerializer.join(categoryElements)}</Typography>;
}

export default CategoriesInTitle;