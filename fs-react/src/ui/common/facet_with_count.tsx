import React from "react";
import {Typography} from "@mui/material";
import Span, {Span2} from "../../custom_ui/span";


function FacetWithCount(prop: {
    displayTitle: string,
    count?: number
}) {
    return <React.Fragment>
        <Span color={'primary'} dangerouslySetInnerHTML={{__html: prop.displayTitle}} className={'fs-facet-title'}></Span>
        {prop.count !== undefined ? <Span2 className={'fs-facet-count'}>&nbsp;({prop.count})</Span2> : ''}
    </React.Fragment>;
}

export default FacetWithCount;