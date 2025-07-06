import React from "react";


function FacetProperty(prop: {
    displayTitle: string,
    frequency: number
}) {
    return <span>
        <span className={'fs-property-facet'}>{prop.displayTitle}</span>
        <span className={'fs-property-frequency'}>&nbsp;({prop.frequency})</span>
    </span>;
}

export default FacetProperty;