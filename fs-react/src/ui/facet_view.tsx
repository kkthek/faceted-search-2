import React from "react";
import {
    Document,
    Property,
    PropertyFacetCount,
    PropertyResponse,
    PropertyValueCount,
    SolrDocumentsResponse, SolrFacetResponse
} from "../common/datatypes";
import Tools from "../util/tools";
import facet_query_builder from "../common/facet_query_builder";
import {SelectedFacet} from "./selected_facets";

export function FacetViewProperty(prop: {
    title: string,
    property: PropertyResponse,
    facets: SolrFacetResponse,
    PropertyFacetCount: PropertyFacetCount|null,
    onPropertyClick: (p: PropertyResponse)=>void,
    onExpandClick: (p: PropertyResponse)=>void
}) {
    let pvc;
    if (prop.facets !== null && prop.facets.valueCounts !== null) {
        pvc = Tools.findFirst(prop.facets.valueCounts, (e) => e.property.title, prop.property.title)
    }

    return <li className={'fs-facets'}>
        <span onClick={() => prop.onExpandClick(prop.property)}>[e]</span>
        <span>({prop.PropertyFacetCount?.count})</span>
        <span onClick={() => prop.onPropertyClick(prop.property)}>{prop.title}</span>
        {pvc ? <SelectedFacet propertyValueCount={pvc}/> : ''}
    </li>
}

function FacetView(prop: {
    results: SolrDocumentsResponse,
    facets: SolrFacetResponse,
    onPropertyClick: (p: PropertyResponse)=>void,
    onExpandClick: (p: PropertyResponse)=>void
}) {
    if (!prop.results) return;
    let properties = prop.results.docs.flatMap((doc, i) => {
        return doc.properties;
    });

    const uniqueProperties = Tools.createUniqueArray(properties, (p: PropertyResponse) => { return p.title });

    const listItems = uniqueProperties.map((property,i) => {
        const facetCount = Tools.findFirst(prop.results.propertyFacetCounts,
            (c) => c.property.title, property.title);

        return <FacetViewProperty key={property.title}
                           title={property.title}
                           property={property}
                           onPropertyClick={prop.onPropertyClick}
                           onExpandClick={prop.onExpandClick}
                           facets={prop.facets}
                           PropertyFacetCount={facetCount}
        />
    }
    );
    return <div id={'fs-facetview'}>
        <ul>
            {listItems}
        </ul>
    </div>;
}

export default FacetView;