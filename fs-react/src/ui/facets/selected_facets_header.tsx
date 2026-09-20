import React, {useContext} from "react";
import {Box, Typography} from "@mui/material";
import {BaseQuery} from "app/common/request/base_query";
import {WikiContext} from "app/index";
import Span from "app/custom_ui/span";

function SelectedFacetsHeader(prop: {
    query: BaseQuery
}) {
    const wikiContext = useContext(WikiContext);

    let noFacetHint;
    if (!prop.query.isAnyFacetSelected()) {
        noFacetHint = <Span color={"secondary"}
                            id={'fs-no-facet-selected'}>
            {"(" + wikiContext.msg('fs-no-facets-selected') + ")"}
        </Span>;
    }
    return <Box key={'selectedFacetLabel'}>
        <Typography key={'fs-selected-facets'}
                    variant={"subtitle1"}>
            {wikiContext.msg('fs-selected-facets')}
        </Typography>
        {noFacetHint}
    </Box>;
}

export default SelectedFacetsHeader;