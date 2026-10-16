import React, {useContext} from "react";
import {Box, Typography} from "@mui/material";
import {BaseQuery} from "app/common/request/base_query";
import {WikiContext} from "app/index";
import Span from "app/custom_ui/span";
import {SearchStateDocument} from "app/common/datatypes";

function SelectedFacetsHeader(prop: {
    query: BaseQuery
    searchStateDocument: SearchStateDocument
}) {
    const wikiContext = useContext(WikiContext);
    if (!prop.searchStateDocument) return;

    const numResults = prop.searchStateDocument.documentResponse.numResults;
    const noResultsWithFacetsSelected = prop.query.isAnyFacetSelected() && numResults === 0;
    const noFacetSelected = !prop.query.isAnyFacetSelected();

    return <Box key={'selectedFacetLabel'}>
        <Typography key={'fs-selected-facets'}
                    variant={"subtitle1"}>
            {wikiContext.msg('fs-selected-facets')}
        </Typography>

        {noFacetSelected ? <Span color={"secondary"} id={'fs-no-facet-selected'}>
            {"(" + wikiContext.msg('fs-no-facets-selected') + ")"}</Span>
            : undefined}

        {noResultsWithFacetsSelected ?
            <Span color={"secondary"} id={'fs-no-results'}>{"(" + wikiContext.msg('fs-no-results') + ")"}</Span>
            : undefined}
    </Box>;
}

export default SelectedFacetsHeader;