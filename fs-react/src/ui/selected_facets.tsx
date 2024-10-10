import React from "react";
import {
    PropertyResponse,
    SolrFacetResponse, ValueCount,
} from "../common/datatypes";
import FacetQueryBuilder from "../common/facet_query_builder";
import {FacetValues} from "./facet_values";


function SelectedFacetsView(prop: {
    results: SolrFacetResponse,
    facetsQueryBuilder: FacetQueryBuilder,
    onPropertyClick: (p: PropertyResponse) => void
    onValueClick: (p: PropertyResponse, v: ValueCount)=>void
}) {
    if (!prop.results) return;

    const valueCounts = prop.results.valueCounts.map((v, i) => {

            return (prop.facetsQueryBuilder.hasPropertyFacet(v.property.title) ? <FacetValues key={v.property.title}
                                                                                              propertyValueCount={v}
                                                                                              onValueClick={prop.onValueClick}
            /> : '');
        }
    );


    return <div id={'fs-selected-facetview'}>
        <ul>
            {valueCounts}
        </ul>
    </div>;
}

export default SelectedFacetsView;