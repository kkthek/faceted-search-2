import Client from "../../common/client";
import React, {useContext} from "react";
import {WikiContext} from "../../index";

import CategoriesInTitle from "./categories_in_title";
import Annotations from "./annotations_snippets";
import ArticleProperties from "./article_properties";
import {Box, Typography} from "@mui/material";
import UserDefinedLinks from "./user_defined_links";
import Span from "../../custom_ui/span";
import {Document} from "../../common/response/document";
import TitleWithPreview from "./title_with_preview";

function SearchResult(prop: { doc: Document, client: Client}) {

    const classNames = getCssClasses(prop.doc);

    let snippet = prop.doc.highlighting;
    if (snippet.length > 500) {
        snippet = snippet.substring(0, 500)+'...';
    }

    return <Box className={classNames.join(' ')}>
        <Box className={'fs-search-result'}>
            <TitleWithPreview doc={prop.doc}/>
        </Box>
        <Box>
            <Typography>
                <Span dangerouslySetInnerHTML={{ __html: snippet }}></Span>
            </Typography>
            <CategoriesInTitle doc={prop.doc}/>
            <UserDefinedLinks doc={prop.doc} client={prop.client}/>
            <Annotations doc={prop.doc}/>
            <ArticleProperties doc={prop.doc} client={prop.client}/>
        </Box>

    </Box>
}

function getCssClasses(doc: Document) {
    const wikiContext = useContext(WikiContext);
    const promotionProperty = wikiContext.config['fs2gPromotionProperty'];
    const demotionProperty = wikiContext.config['fs2gDemotionProperty'];

    const classNames = [];
    if (promotionProperty !== false && doc.containsFacetValue(promotionProperty, true)) {
        classNames.push('promoted');
    }
    if (demotionProperty !== false && doc.containsFacetValue(demotionProperty, true)) {
        classNames.push('demoted');
    }
    return classNames;
}

export default SearchResult;