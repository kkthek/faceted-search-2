import React, {useContext, useState} from "react";
import {Document} from "../common/datatypes";
import {WikiContext} from "../index";
import Client from "../common/client";
import {Divider, Pagination, Stack, Typography} from "@mui/material";
import SearchResult from "./search_result";
import EventHandler from "../common/event_handler";


function ResultView(prop: {
    results: Document[],
    numResults: number,
    eventHandler: EventHandler
    client: Client
}) {

    const [pageIndex, setPageIndex] = useState(1);
    const wikiContext = useContext(WikiContext);

    const NUMBER_RESULTS_ONE_PAGE = wikiContext.config['fs2gHitsPerPage'];
    const totalNumberOfPages = Math.trunc(prop.numResults / NUMBER_RESULTS_ONE_PAGE) + 1;

    const listItems = prop.results.map((doc, i) =>
        <SearchResult key={doc.id} doc={doc} client={prop.client}/>
    );

    const from = (pageIndex - 1) * NUMBER_RESULTS_ONE_PAGE + 1;
    const to = Math.min(from + NUMBER_RESULTS_ONE_PAGE - 1, prop.numResults);

    function onPageIndexChange(event: React.ChangeEvent<unknown>, pageIndex: number) {
        prop.eventHandler.onPageIndexClick(pageIndex, NUMBER_RESULTS_ONE_PAGE);
        setPageIndex(pageIndex);
        window.scrollTo(0, 0);
    }

    return <div id={'fs-resultview'}>
        <Typography id={'fs-result-view-number'}>{wikiContext.msg('fs-results-from-to', from, to, prop.numResults)}</Typography>
        <Divider/>
        <Stack>
            {listItems}
        </Stack>
        <Divider/>
        <Pagination count={totalNumberOfPages}
                    defaultPage={1}
                    siblingCount={2}
                    onChange={onPageIndexChange}/>
    </div>;
}

export default ResultView;