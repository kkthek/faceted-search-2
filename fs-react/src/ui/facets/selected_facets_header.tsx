import Span from "../../custom_ui/span";
import React, {useContext} from "react";
import {SearchStateFacet} from "../../common/event_handler";
import {WikiContext} from "../../index";
import {Box, Typography} from "@mui/material";

function SelectedFacetsHeader(prop: {
    searchFacetState: SearchStateFacet
}) {
    const wikiContext = useContext(WikiContext);

    let noFacetHint;
    if (prop.searchFacetState?.query.isAnyFacetSelected()) {
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