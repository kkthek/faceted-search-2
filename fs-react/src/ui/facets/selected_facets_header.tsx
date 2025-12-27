import Span from "../../custom_ui/span";
import React, {useContext} from "react";
import {WikiContext} from "../../index";
import {Box, Typography} from "@mui/material";
import {BaseQuery} from "../../common/request/base_query";

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