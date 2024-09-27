import React from "react";
import {
    Document,
    Property,
    PropertyFacetCount,
    PropertyResponse,
    PropertyValueCount,
    SolrDocumentsResponse
} from "../common/datatypes";
import Tools from "../util/tools";

export function FacetViewProperty(prop: {
    title: string,
    property: PropertyResponse,
    PropertyFacetCount: PropertyFacetCount|null,
    onPropertyClick: (p: PropertyResponse)=>void
}) {
    return <li className={'fs-facets'} onClick={() => prop.onPropertyClick(prop.property)}><span>({prop.PropertyFacetCount?.count})</span>{prop.title}</li>
}

function FacetView(prop: {results: SolrDocumentsResponse, onPropertyClick: (p: PropertyResponse)=>void}) {
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