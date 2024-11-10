import React from "react";
import {SearchStateDocument} from "./event_handler";
import {DocumentQuery} from "../common/datatypes";

function PagingView(prop: {
    searchStateDocument: SearchStateDocument,
    onPageIndexClick: (pageIndex: number, limit: number)=>void,
}) {
    if (!prop.searchStateDocument) {
        return;
    }
    const NUMBER_RESULTS_ONE_PAGE = 10; // could come from config
    const SLIDING_WINDOW_SIZE = 10;     // could come from config

    const numPages = Math.trunc(prop.searchStateDocument.documentResponse.numResults / NUMBER_RESULTS_ONE_PAGE) + 1;
    const slidingWindowSize = Math.min(SLIDING_WINDOW_SIZE, numPages);
    const documentQuery = prop.searchStateDocument.query as DocumentQuery
    const currentPageIndex  = Math.trunc(documentQuery.offset / NUMBER_RESULTS_ONE_PAGE);
    let start = Math.max(0, currentPageIndex - slidingWindowSize/2);
    if (start + slidingWindowSize > numPages) {
        start = Math.max(0, numPages - slidingWindowSize);
    }
    let pageIndexesSlidingWindow = Array.from(Array(slidingWindowSize), (_, i) => +i+1 + start);

    const slidingWindow = pageIndexesSlidingWindow.map((pageIndex) => {
        return <span key={pageIndex} className={'fs-clickable ' + (currentPageIndex===pageIndex-1?'fs-selected':'')}
                     onClick={() => prop.onPageIndexClick((pageIndex-1), NUMBER_RESULTS_ONE_PAGE)}>[ {pageIndex} ]</span>
    })

    return <div id={'fs-paginator'}>
        {currentPageIndex > 0 ? <span className={'fs-clickable'} onClick={() => prop.onPageIndexClick(0, NUMBER_RESULTS_ONE_PAGE)}>[&lt;&lt;]</span> : ''}
        {currentPageIndex > 0 ? <span className={'fs-clickable'} onClick={() => prop.onPageIndexClick((currentPageIndex-1), NUMBER_RESULTS_ONE_PAGE)}>[&lt;]</span>: ''}
        {slidingWindow}
        {currentPageIndex + 1 < numPages - 1 ? <span className={'fs-clickable'} onClick={() => prop.onPageIndexClick((currentPageIndex+1), NUMBER_RESULTS_ONE_PAGE)}>[&gt;]</span>: ''}
        {currentPageIndex < numPages - 1 ? <span className={'fs-clickable'} onClick={() => prop.onPageIndexClick((numPages-1), NUMBER_RESULTS_ONE_PAGE)}>[&gt;&gt;]</span>: ''}
    </div>
}

export default PagingView;