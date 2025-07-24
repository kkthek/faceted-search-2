import React from "react";


function FacetWithCount(prop: {
    displayTitle: string,
    count?: number
}) {
    return <React.Fragment>
        <span className={'fs-facet-title'}>{prop.displayTitle}</span>
        {prop.count !== undefined ? <span className={'fs-facet-count'}>&nbsp;({prop.count})</span> : ''}
    </React.Fragment>;
}

export default FacetWithCount;