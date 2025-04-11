import React, {useContext} from "react";
import {Document} from "../common/datatypes";
import WikiLink from "./wiki_link";
import Annotations from "./annotations_snippets";
import CategoriesInTitle from "./categories_in_title";
import ArticleProperties from "./article_properties";
import {WikiContext} from "../index";
import Client from "../common/client";

function containsTrueFacetValue(doc: Document, property: string) {
    let propertyFacetValues = doc.getPropertyFacetValues(property);
    if (propertyFacetValues === null) return false;
    let values = propertyFacetValues.values as boolean[];
    return values.includes(true);
}

function SearchResult(prop: { doc: Document, client: Client}) {
    let wikiContext = useContext(WikiContext);
    let promotionProperty = wikiContext.config['fsg2PromotionProperty'];
    let demotionProperty = wikiContext.config['fsg2DemotionProperty'];
    let classNames = ['fs-search-result'];
    if (promotionProperty !== false && containsTrueFacetValue(prop.doc, promotionProperty)) {
        classNames.push('promoted');
    }
    if (demotionProperty !== false&& containsTrueFacetValue(prop.doc, demotionProperty)) {
        classNames.push('demoted');
    }

    let snippet = prop.doc.highlighting.length > 500 ? prop.doc.highlighting.substring(0, 500)+'...': prop.doc.highlighting;
    return <li className={classNames.join(' ')}>
        <span><WikiLink page={prop.doc}/></span>
        <div dangerouslySetInnerHTML={{ __html: snippet }}></div>
        <CategoriesInTitle doc={prop.doc}/>
        <Annotations doc={prop.doc}/>
        <ArticleProperties doc={prop.doc} client={prop.client}/>
    </li>
}


function ResultView(prop: {results: Document[], client: Client}) {
    const listItems = prop.results.map((doc,i) =>
        <SearchResult key={doc.id} doc={doc} client={prop.client} />
    );
    return <div id={'fs-resultview'}>
        <ul>
            {listItems}
        </ul>
    </div>;
}

export default ResultView;