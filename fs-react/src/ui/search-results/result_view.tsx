import React, {useContext, useState} from "react";
import {Document} from "../../common/datatypes";
import {WikiContext} from "../../index";
import Client from "../../common/client";
import {Box, Divider, Pagination, Stack, Typography} from "@mui/material";
import SearchResult from "./search_result";
import EventHandler from "../../common/event_handler";
import Span from "../../custom_ui/span";


function ResultView(prop: {
    results: Document[],
    numResults: number,
    pageOffset: number,
    eventHandler: EventHandler
    client: Client
}) {

    const [pageIndex, setPageIndex] = useState(1);
    const wikiContext = useContext(WikiContext);

    const fs2gHitsPerPage = wikiContext.config['fs2gHitsPerPage'];
    const totalNumberOfPages = Math.trunc(prop.numResults / fs2gHitsPerPage) + 1;
    const currentPageIndex = prop.pageOffset/fs2gHitsPerPage+1;
    if (pageIndex !== currentPageIndex) {
        setPageIndex(currentPageIndex);
    }

    const listItems = prop.results.map((doc, i) =>
        <SearchResult key={doc.id} doc={doc} client={prop.client}/>
    );

    const from = (pageIndex - 1) * fs2gHitsPerPage + 1;
    const to = Math.min(from + fs2gHitsPerPage - 1, prop.numResults);

    function onPageIndexChange(event: React.ChangeEvent<unknown>, pageIndex: number) {
        prop.eventHandler.onPageIndexClick(pageIndex, fs2gHitsPerPage);
        setPageIndex(pageIndex);
        window.scrollTo(0, 0);
    }

    return <Box id={'fs-resultview'}>
        <Span color={"secondary"}>{wikiContext.msg('fs-results-from-to', from, to, prop.numResults)}</Span>
        <Divider/>
        <Stack>
            {listItems}
        </Stack>
        <Divider/>
        <Pagination count={totalNumberOfPages}
                    page={pageIndex}
                    siblingCount={2}
                    onChange={onPageIndexChange}/>
    </Box>;
}

export default ResultView;