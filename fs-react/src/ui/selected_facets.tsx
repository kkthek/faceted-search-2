import React from "react";
import {
    PropertyResponse,
    PropertyValueCount, RangeValueCounts,
    SolrFacetResponse,
} from "../common/datatypes";
import FacetQueryBuilder from "../common/facet_query_builder";

export function SelectedFacet(prop: {
    propertyValueCount: PropertyValueCount
}) {

    const listItems = prop.propertyValueCount.values.map((v, i) => {
        return <li>{v.value === null ? v.mwTitle.displayTitle : v.value}:{v.count}</li>
    });
    return <div>
        <span>({prop.propertyValueCount.property.title})</span>
        <ul className={'fs-facets'}>
            {listItems}
        </ul>
    </div>
}

export function SelectedFacetRangeValue(prop: {
    rangeValueCount: RangeValueCounts
}) {

    const listItems = prop.rangeValueCount.values.map((v, i) => {
        return <li>{v.range.from}-{v.range.to}:{v.count}</li>
    });
    return <div>
        <span>({prop.rangeValueCount.property.title})</span>
        <ul className={'fs-facets'}>
            {listItems}
        </ul>
    </div>
}

function SelectedFacetsView(prop: {
    results: SolrFacetResponse,
    facetsQueryBuilder: FacetQueryBuilder,
    onPropertyClick: (p: PropertyResponse) => void
}) {
    if (!prop.results) return;

    const valueCounts = prop.results.valueCounts.map((v, i) => {

            return (prop.facetsQueryBuilder.hasPropertyFacet(v.property.title) ? <SelectedFacet key={v.property.title}
                                  propertyValueCount={v}
            /> : '');
        }
    );

    const rangeValueCounts = prop.results.rangeValueCounts.map((v, i) => {
            return <SelectedFacetRangeValue key={v.property.title}
                                  rangeValueCount={v}
            />
        }
    );
    return <div id={'fs-selected-facetview'}>
        <ul>
            {rangeValueCounts}
            {valueCounts}
        </ul>
    </div>;
}

export default SelectedFacetsView;