import React from "react";
import {Document} from "../common/datatypes";


function SearchResult(prop: {title: string, snippet: string}) {
    return <li className={'fs-search-result'}>{prop.title}<p>{prop.snippet}</p></li>
}

function ResultView(prop: {results: Document[]}) {
    const listItems = prop.results.map(doc =>
        <SearchResult title={doc.title} snippet={doc.highlighting} />
    );
    return <div id={'fs-resultview'}>
        <ul>
            {listItems}
        </ul>
    </div>;
}

export default ResultView;