import React, {useRef} from "react";
import {
    BaseQuery,
    Property,
    PropertyFacet,
    PropertyFacetCount,
    PropertyWithURL,
    SolrFacetResponse
} from "../common/datatypes";
import Tools from "../util/tools";
import FacetValues from "./facet_values_view";
import {SearchStateDocument, SearchStateFacet} from "./event_handler";


function FacetViewProperty(prop: {
    query: BaseQuery,
    title: string,
    property: PropertyWithURL,
    searchStateFacets: SolrFacetResponse,
    selectedFacets: PropertyFacet[],
    propertyFacetCount: PropertyFacetCount|null,
    onPropertyClick: (p: Property)=>void,
    onExpandClick: (p: Property)=>void,
    onValueClick: (p: PropertyFacet)=>void,
    onRemoveClick: (p: PropertyFacet)=>void,
}) {

    let propertyValueCount = prop.searchStateFacets ? prop.searchStateFacets.getPropertyValueCount(prop.property) : null;
    let isSelectedFacet = Tools.findFirst(prop.selectedFacets, (e) => e.property, prop.property.title) !== null;
    let facetValuesDiv = useRef<any>(null);

    return <li className={'fs-facets'}>
        <span onClick={() => {
            if (propertyValueCount === null) {
                prop.onExpandClick(prop.property);
                return;
            }
            const div = facetValuesDiv.current;
            div.style.display = div.checkVisibility() ? 'none' :'block';
        } }>[e]</span>
        <span>({prop.propertyFacetCount?.count})</span>
        <span onClick={() => prop.onPropertyClick(prop.property)}>{prop.title}</span>
        {!isSelectedFacet ? <div ref={facetValuesDiv}>
            <FacetValues propertyValueCount={propertyValueCount}
                                         onValueClick={prop.onValueClick}
                                         removable={false}
                                         query={prop.query}
                                         onRemoveClick={prop.onRemoveClick}
        /></div> : ''}
    </li>
}

function FacetView(prop: {
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    onPropertyClick: (p: Property)=>void,
    onExpandClick: (p: Property)=>void,
    onValueClick: (p: PropertyFacet)=>void,
    onRemoveClick: (p: PropertyFacet)=>void,
}) {
    if (!prop.searchStateDocument) return;
    let properties = prop.searchStateDocument.documentResponse.docs.flatMap((doc, i) => {
        return doc.properties;
    });

    const uniqueProperties = Tools.makeArrayUnique(properties, (p: PropertyWithURL) => { return p.title });

    const listItems = uniqueProperties.map((property,i) => {
        const facetCount = Tools.findFirst(prop.searchStateDocument.documentResponse.propertyFacetCounts,
            (c) => c.property.title, property.title);

        return <FacetViewProperty key={property.title}
                           query={prop.searchStateDocument.query}
                           title={property.title}
                           property={property}
                           onPropertyClick={prop.onPropertyClick}
                           onExpandClick={prop.onExpandClick}
                           onValueClick={prop.onValueClick}
                           searchStateFacets={prop.searchStateFacets?.facetsResponse}
                           selectedFacets={prop.searchStateDocument.query.propertyFacets}
                           propertyFacetCount={facetCount}
                           onRemoveClick={prop.onRemoveClick}
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