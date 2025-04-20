import React, {useContext} from "react";
import {SearchStateDocument} from "./event_handler";
import {WikiContext} from "../index";
import {Pagination} from "@mui/material";

function PagingView(prop: {
    searchStateDocument: SearchStateDocument,
    onPageIndexClick: (pageIndex: number, limit: number)=>void,
}) {
    if (!prop.searchStateDocument) {
        return;
    }
    let wikiContext = useContext(WikiContext);

    const NUMBER_RESULTS_ONE_PAGE = wikiContext.config['fs2gHitsPerPage'];
    const totalNumberOfPages = Math.trunc(prop.searchStateDocument.documentResponse.numResults / NUMBER_RESULTS_ONE_PAGE) + 1;

    return  <Pagination count={totalNumberOfPages}
                        defaultPage={1}
                        siblingCount={2}
                        onChange={(e, pageNumber) => prop.onPageIndexClick(pageNumber, NUMBER_RESULTS_ONE_PAGE)}/>

}

export default PagingView;