import React, {useContext, useRef} from "react";
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
import {WikiContext} from "../index";


function FacetViewProperty(prop: {
    query: BaseQuery,
    title: string,
    property: PropertyWithURL,
    searchStateFacets: SolrFacetResponse,
    selectedFacets: PropertyFacet[],
    propertyFacetCount: PropertyFacetCount|null,
    onPropertyClick: (p: Property)=>void,
    onExpandClick: (p: Property, limit: number)=>void,
    onValueClick: (p: PropertyFacet)=>void,
    onRemoveClick: (p: PropertyFacet)=>void,
    onFilterContainsClick: (text: string, property: Property) => void
}) {

    let propertyValueCount = prop.searchStateFacets ? prop.searchStateFacets.getPropertyValueCount(prop.property) : null;
    let isSelectedFacet = Tools.findFirst(prop.selectedFacets, (e) => e.property, prop.property.title) !== null;
    let facetValuesDiv = useRef<any>(null);
    let wikiContext = useContext(WikiContext);
    let showMore = wikiContext.fsgFacetValueLimit === propertyValueCount?.values.length;

    function handleExpandClick(limit: number) {
        if (propertyValueCount === null) {
            prop.onExpandClick(prop.property, limit);
            return;
        }
        const div = facetValuesDiv.current;
        div.style.display = div.checkVisibility() ? 'none' : 'block';
    }
    let showMoreButton = (showMore ? <div>
        <a onClick={() => prop.onExpandClick(prop.property, null)}>show more...</a> </div>
        : <div></div>);

    return <li className={'fs-facets'}>
        <span onClick={() => handleExpandClick(wikiContext.fsgFacetValueLimit)}>[e]</span>
        <span onClick={() => prop.onPropertyClick(prop.property)}>{prop.property.displayTitle}</span>
        <span>({prop.propertyFacetCount?.count})</span>
        {!isSelectedFacet ? <div ref={facetValuesDiv}>
            <FacetValues propertyValueCount={propertyValueCount}
                                         onValueClick={prop.onValueClick}
                                         removable={false}
                                         query={prop.query}
                                         onRemoveClick={prop.onRemoveClick}
                                         onFilterContainsClick={prop.onFilterContainsClick}
        />
            {showMoreButton}
        </div> : ''}
    </li>
}

function FacetView(prop: {
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    onPropertyClick: (p: Property)=>void,
    onExpandClick: (p: Property, limit: number)=>void,
    onValueClick: (p: PropertyFacet)=>void,
    onRemoveClick: (p: PropertyFacet)=>void,
    onFilterContainsClick: (text: string, property: Property) => void
}) {
    if (!prop.searchStateDocument) return;

    const propertyFacetCounts = prop.searchStateDocument.documentResponse.propertyFacetCounts;

    const listItems = propertyFacetCounts.map((facetCount,i) => {

        return <FacetViewProperty key={facetCount.property.title+facetCount.property.type}
                           query={prop.searchStateDocument.query}
                           title={facetCount.property.title}
                           property={facetCount.property}
                           onPropertyClick={prop.onPropertyClick}
                           onExpandClick={prop.onExpandClick}
                           onValueClick={prop.onValueClick}
                           searchStateFacets={prop.searchStateFacets?.facetsResponse}
                           selectedFacets={prop.searchStateDocument.query.propertyFacets}
                           propertyFacetCount={facetCount}
                           onRemoveClick={prop.onRemoveClick}
                           onFilterContainsClick={prop.onFilterContainsClick}
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