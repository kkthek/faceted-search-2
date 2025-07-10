import React from "react";


function FacetWithCount(prop: {
    displayTitle: string,
    count: number|void
}) {
    return <span>
        <span className={'fs-facet-title'}>{prop.displayTitle}</span>
        {prop.count ? <span className={'fs-facet-count'}>&nbsp;({prop.count})</span> : ''}
    </span>;
}

export default FacetWithCount;