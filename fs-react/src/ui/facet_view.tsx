import React from "react";
import {
    PropertyFacet,
    PropertyFacetCount,
    PropertyResponse,
    SolrDocumentsResponse,
    SolrFacetResponse,
    ValueCount
} from "../common/datatypes";
import Tools from "../util/tools";
import FacetValues from "./facet_values_view";


export function FacetViewProperty(prop: {
    title: string,
    property: PropertyResponse,
    facets: SolrFacetResponse,
    selectedFacets: PropertyFacet[],
    PropertyFacetCount: PropertyFacetCount|null,
    onPropertyClick: (p: PropertyResponse)=>void,
    onExpandClick: (p: PropertyResponse)=>void,
    onValueClick: (p: PropertyResponse, v: ValueCount)=>void
}) {
    let propertyValueCount = Tools.findFirst(prop.facets?.valueCounts || [], (e) => e.property.title, prop.property.title);
    let isSelectedFacet = Tools.findFirst(prop.selectedFacets, (e) => e.property, prop.property.title) !== null;

    return <li className={'fs-facets'}>
        <span onClick={() => prop.onExpandClick(prop.property)}>[e]</span>
        <span>({prop.PropertyFacetCount?.count})</span>
        <span onClick={() => prop.onPropertyClick(prop.property)}>{prop.title}</span>
        {!isSelectedFacet ? <FacetValues propertyValueCount={propertyValueCount} onValueClick={prop.onValueClick}/> : ''}
    </li>
}

function FacetView(prop: {
    results: SolrDocumentsResponse,
    facets: SolrFacetResponse,
    selectedFacets: PropertyFacet[],
    onPropertyClick: (p: PropertyResponse)=>void,
    onExpandClick: (p: PropertyResponse)=>void,
    onValueClick: (p: PropertyResponse, v: ValueCount)=>void
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
                           selectedFacets={prop.selectedFacets}
                           PropertyFacetCount={facetCount}
                           onValueClick={prop.onValueClick}
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