import React from "react";
import {Document} from "../common/datatypes";


function SearchResult(prop: { doc: Document}) {
    return <li className={'fs-search-result'}>
        <span>{prop.doc.title}</span>
        <div dangerouslySetInnerHTML={{ __html: prop.doc.highlighting }}></div>
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