import React, {useContext, useState} from "react";
import {Document} from "../common/datatypes";
import {WikiContext} from "../index";
import Client from "../common/client";
import {Divider, List, Pagination, Stack, Typography} from "@mui/material";
import SearchResult from "./search_result";


function ResultView(prop: {
    results: Document[],
    numResults: number,
    onPageIndexClick: (pageIndex: number, limit: number)=>void,
    client: Client}) {

    const [pageIndex, setPageIndex] = useState(1);
    let wikiContext = useContext(WikiContext);

    const NUMBER_RESULTS_ONE_PAGE = wikiContext.config['fs2gHitsPerPage'];
    const totalNumberOfPages = Math.trunc(prop.numResults / NUMBER_RESULTS_ONE_PAGE) + 1;

    const listItems = prop.results.map((doc,i) =>
        <SearchResult key={doc.id} doc={doc} client={prop.client} />
    );
    let from = (pageIndex-1)*NUMBER_RESULTS_ONE_PAGE+1;
    let to = Math.min(from + NUMBER_RESULTS_ONE_PAGE - 1, prop.numResults);

    return <div id={'fs-resultview'}>
        <Typography>Results {from} to {to} of {prop.numResults}</Typography>
        <Divider/>
        <Stack>
            {listItems}
        </Stack>
        <Divider/>
        <Pagination count={totalNumberOfPages}
                    defaultPage={1}
                    siblingCount={2}
                    onChange={(e, pageIndex) => {
                        prop.onPageIndexClick(pageIndex, NUMBER_RESULTS_ONE_PAGE);
                        setPageIndex(pageIndex);
                    }  }/>
    </div>;
}

export default ResultView;