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
import {SearchStateDocument, SearchStateFacet} from "./event_handler";


function FacetViewProperty(prop: {
    title: string,
    property: PropertyResponse,
    searchStateFacets: SolrFacetResponse,
    selectedFacets: PropertyFacet[],
    propertyFacetCount: PropertyFacetCount|null,
    onPropertyClick: (p: PropertyResponse)=>void,
    onExpandClick: (p: PropertyResponse)=>void,
    onValueClick: (p: PropertyResponse, v: ValueCount)=>void
}) {

    let propertyValueCount = Tools.findFirst(prop.searchStateFacets?.valueCounts || [], (e) => e.property.title, prop.property.title);
    let isSelectedFacet = Tools.findFirst(prop.selectedFacets, (e) => e.property, prop.property.title) !== null;

    return <li className={'fs-facets'}>
        <span onClick={() => prop.onExpandClick(prop.property)}>[e]</span>
        <span>({prop.propertyFacetCount?.count})</span>
        <span onClick={() => prop.onPropertyClick(prop.property)}>{prop.title}</span>
        {!isSelectedFacet ? <FacetValues propertyValueCount={propertyValueCount} onValueClick={prop.onValueClick}/> : ''}
    </li>
}

function FacetView(prop: {
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    onPropertyClick: (p: PropertyResponse)=>void,
    onExpandClick: (p: PropertyResponse)=>void,
    onValueClick: (p: PropertyResponse, v: ValueCount)=>void
}) {
    if (!prop.searchStateDocument) return;
    let properties = prop.searchStateDocument.documentResponse.docs.flatMap((doc, i) => {
        return doc.properties;
    });

    const uniqueProperties = Tools.createUniqueArray(properties, (p: PropertyResponse) => { return p.title });

    const listItems = uniqueProperties.map((property,i) => {
        const facetCount = Tools.findFirst(prop.searchStateDocument.documentResponse.propertyFacetCounts,
            (c) => c.property.title, property.title);

        return <FacetViewProperty key={property.title}
                           title={property.title}
                           property={property}
                           onPropertyClick={prop.onPropertyClick}
                           onExpandClick={prop.onExpandClick}
                           onValueClick={prop.onValueClick}
                           searchStateFacets={prop.searchStateFacets?.facetsResponse}
                           selectedFacets={prop.searchStateDocument.query.propertyFacets}
                           propertyFacetCount={facetCount}
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