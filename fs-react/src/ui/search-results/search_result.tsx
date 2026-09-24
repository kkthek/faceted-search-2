import React, {useContext} from "react";
import {Box, Typography} from "@mui/material";
import {Document} from "app/common/response/document";
import Client from "app/common/client";
import TitleWithPreview from "app/ui/search-results/title_with_preview";
import CategoriesInTitle from "app/ui/search-results/categories_in_title";
import Span from "app/custom_ui/span";
import UserDefinedLinks from "app/ui/search-results/user_defined_links";
import Annotations from "app/ui/search-results/annotations_snippets";
import ArticleProperties from "app/ui/search-results/article_properties";
import {WikiContext} from "app/index";

function SearchResult(prop: { doc: Document, client: Client}) {

    const classNames = getCssClasses(prop.doc);

    let snippet = prop.doc.highlighting;
    if (snippet.length > 500) {
        snippet = snippet.substring(0, 500)+'...';
    }

    return <Box className={classNames.join(' ')}>
        <Box className={'fs-search-result'}>
            <TitleWithPreview doc={prop.doc}/> <CategoriesInTitle doc={prop.doc}/>
        </Box>
        <Box>
            <Typography>
                <Span dangerouslySetInnerHTML={{ __html: snippet }}></Span>
            </Typography>
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