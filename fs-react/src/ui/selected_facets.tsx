import React from "react";
import {
    PropertyResponse,
    SolrFacetResponse,
} from "../common/datatypes";
import FacetQueryBuilder from "../common/facet_query_builder";
import {FacetValues} from "./facet_values";


function SelectedFacetsView(prop: {
    results: SolrFacetResponse,
    facetsQueryBuilder: FacetQueryBuilder,
    onPropertyClick: (p: PropertyResponse) => void
}) {
    if (!prop.results) return;

    const valueCounts = prop.results.valueCounts.map((v, i) => {

            return (prop.facetsQueryBuilder.hasPropertyFacet(v.property.title) ? <FacetValues key={v.property.title}
                                                                                              propertyValueCount={v}
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