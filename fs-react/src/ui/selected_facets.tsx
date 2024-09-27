import React from "react";
import {PropertyResponse, SolrDocumentsResponse} from "../common/datatypes";
import DocumentQueryBuilder from "../common/query_builder";
import Tools from "../util/tools";
import {FacetViewProperty} from "./facet_view";


function SelectedFacetsView(prop: {
    results: SolrDocumentsResponse,
    documentQueryBuilder: DocumentQueryBuilder,
    onPropertyClick: (p: PropertyResponse)=>void
}) {
    if (!prop.results) return;
    let properties = prop.results.docs.flatMap((doc, i) => {
        return doc.properties;
    });
    const uniqueProperties = Tools.createUniqueArray(properties, (p: PropertyResponse) => { return p.title });
    const selectedFacets = uniqueProperties.filter((p) => prop.documentQueryBuilder.hasPropertyFacet(p.title));

    const listItems = selectedFacets.map((property,i) => {
            const facetCount = Tools.findFirst(prop.results.propertyFacetCounts,
                (c) => c.property.title, property.title);

            return <FacetViewProperty key={property.title}
                                      title={property.title}
                                      property={property}
                                      onPropertyClick={prop.onPropertyClick}
                                      PropertyFacetCount={facetCount}
            />
        }
    );

    return <div id={'fs-selected-facetview'}>
        <ul>
            {listItems}
        </ul>
    </div>;
}

export default SelectedFacetsView;