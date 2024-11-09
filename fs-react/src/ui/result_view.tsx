import React from "react";
import {Document} from "../common/datatypes";
import WikiLink from "./wiki_link";


function SearchResult(prop: { doc: Document}) {
    let snippet = prop.doc.highlighting.length > 500 ? prop.doc.highlighting.substring(0, 500)+'...': prop.doc.highlighting;
    return <li className={'fs-search-result'}>
        <span><WikiLink doc={prop.doc}/></span>
        <div dangerouslySetInnerHTML={{ __html: snippet }}></div>
    </li>
}

function ResultView(prop: {results: Document[]}) {
    const listItems = prop.results.map((doc,i) =>
        <SearchResult key={doc.id} doc={doc} />
    );
    return <div id={'fs-resultview'}>
        <ul>
            {listItems}
        </ul>
    </div>;
}

export default ResultView;