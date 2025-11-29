import React from "react";
import Span from "../../custom_ui/span";


function FacetWithCount(prop: {
    displayTitle: string,
    count?: number
}) {
    return <React.Fragment>
        <Span color={'primary'} dangerouslySetInnerHTML={{__html: prop.displayTitle}} className={'fs-facet-title'}></Span>
        {prop.count !== undefined ? <Span color={'secondary'} className={'fs-facet-count'}>&nbsp;({prop.count})</Span> : ''}
    </React.Fragment>;
}

export default FacetWithCount;