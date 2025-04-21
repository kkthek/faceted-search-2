import {Document} from "../common/datatypes";
import Client from "../common/client";
import React, {useContext} from "react";
import {WikiContext} from "../index";
import WikiLink from "./wiki_link";
import PreviewPopup from "./preview_popup";
import CategoriesInTitle from "./categories_in_title";
import Annotations from "./annotations_snippets";
import ArticleProperties from "./article_properties";
import ConfigUtils from "../util/config_utils";
import {ListItem, ListItemText} from "@mui/material";

function SearchResult(prop: { doc: Document, client: Client}) {
    let wikiContext = useContext(WikiContext);
    let promotionProperty = wikiContext.config['fs2gPromotionProperty'];
    let demotionProperty = wikiContext.config['fs2gDemotionProperty'];
    let showSolrScore = wikiContext.config['fs2gShowSolrScore'];

    let classNames = ['fs-search-result'];
    if (promotionProperty !== false && ConfigUtils.containsTrueFacetValue(prop.doc, promotionProperty)) {
        classNames.push('promoted');
    }
    if (demotionProperty !== false&& ConfigUtils.containsTrueFacetValue(prop.doc, demotionProperty)) {
        classNames.push('demoted');
    }

    let snippet = prop.doc.highlighting.length > 500 ? prop.doc.highlighting.substring(0, 500)+'...': prop.doc.highlighting;
    return <div className={classNames.join(' ')}>
        <div title={showSolrScore ? "score: " + prop.doc.score : ''}>
            <WikiLink page={prop.doc}/>
            <PreviewPopup doc={prop.doc} />

        </div>
        <div><span dangerouslySetInnerHTML={{ __html: snippet }}></span>
            <CategoriesInTitle doc={prop.doc}/>
            <Annotations doc={prop.doc}/>
            <ArticleProperties doc={prop.doc} client={prop.client}/>
        </div>


    </div>
};

export default SearchResult;