import React from "react";
import {SearchStateDocument} from "./event_handler";
import {DocumentQuery} from "../common/datatypes";

function PagingView(prop: {
    searchStateDocument: SearchStateDocument,
    onPageIndexClick: (offset: number)=>void,
}) {
    if (!prop.searchStateDocument) {
        return;
    }
    const NUMBER_RESULTS_ONE_PAGE = 10;
    const SLIDING_WINDOW_SIZE = 10;

    const numPages = Math.round(prop.searchStateDocument.documentResponse.numResults / NUMBER_RESULTS_ONE_PAGE) + 1;
    const slidingWindowSize = Math.min(SLIDING_WINDOW_SIZE, numPages);
    const documentQuery = prop.searchStateDocument.query as DocumentQuery
    const currentPageIndex  = Math.round(documentQuery.offset / NUMBER_RESULTS_ONE_PAGE);
    let start = Math.max(0, currentPageIndex - slidingWindowSize/2);
    if (start + slidingWindowSize > numPages) {
        start = Math.max(0, numPages - slidingWindowSize);
    }
    let pageIndexesSlidingWindow = Array.from(Array(slidingWindowSize), (_, i) => +i+1 + start);

    const slidingWindow = pageIndexesSlidingWindow.map((pageIndex) => {
        return <span key={pageIndex} onClick={() => prop.onPageIndexClick((pageIndex-1) * NUMBER_RESULTS_ONE_PAGE)}>[ {pageIndex} ]</span>
    })

    return <div>
        {slidingWindow}
    </div>
}

export default PagingView;