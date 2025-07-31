import {Document} from "../common/datatypes";
import Client from "../common/client";
import React, {useContext} from "react";
import {WikiContext} from "../index";
import WikiLink from "./wiki_link";
import PreviewPopup from "./preview_popup";
import CategoriesInTitle from "./categories_in_title";
import Annotations from "./annotations_snippets";
import ArticleProperties from "./article_properties";
import {Box, Typography} from "@mui/material";
import UserDefinedLinks from "./user_defined_links";

function SearchResult(prop: { doc: Document, client: Client}) {
    const wikiContext = useContext(WikiContext);
    const promotionProperty = wikiContext.config['fs2gPromotionProperty'];
    const demotionProperty = wikiContext.config['fs2gDemotionProperty'];
    const showSolrScore = wikiContext.config['fs2gShowSolrScore'];

    const classNames = [];
    if (promotionProperty !== false && prop.doc.containsTrueFacetValue(promotionProperty)) {
        classNames.push('promoted');
    }
    if (demotionProperty !== false&& prop.doc.containsTrueFacetValue(demotionProperty)) {
        classNames.push('demoted');
    }

    const snippet = prop.doc.highlighting.length > 500 ? prop.doc.highlighting.substring(0, 500)+'...': prop.doc.highlighting;
    return <Box className={classNames.join(' ')}>
        <Box className={'fs-search-result'} title={showSolrScore ? "score: " + prop.doc.score : ''}>
            <Typography>
                <span className={'fs-search-result-title'}><WikiLink page={prop.doc}/></span>
                <PreviewPopup doc={prop.doc} />
            </Typography>

        </Box>
        <Box><Typography><span dangerouslySetInnerHTML={{ __html: snippet }}></span></Typography>
            <CategoriesInTitle doc={prop.doc}/>
            <UserDefinedLinks doc={prop.doc}/>
            <Annotations doc={prop.doc}/>
            <ArticleProperties doc={prop.doc} client={prop.client}/>
        </Box>


    </Box>
};

export default SearchResult;