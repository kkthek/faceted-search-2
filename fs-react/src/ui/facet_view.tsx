import React, {useContext, useRef, useState} from "react";
import {
    BaseQuery,
    Property,
    PropertyFacet,
    PropertyFacetCount,
    PropertyWithURL,
    FacetResponse
} from "../common/datatypes";
import Tools from "../util/tools";
import FacetValues from "./facet_values_view";
import {SearchStateDocument, SearchStateFacet} from "./event_handler";
import {WikiContext} from "../index";
import ConfigUtils from "../util/config_utils";
import FacetOrDialog from "./facet_or_dialog";


function FacetViewProperty(prop: {
    query: BaseQuery,
    title: string,
    property: PropertyWithURL,
    searchStateFacets: FacetResponse,
    selectedFacets: PropertyFacet[],
    propertyFacetCount: PropertyFacetCount|null,
    onPropertyClick: (p: Property)=>void,
    onExpandClick: (p: Property, limit: number)=>void,
    onValueClick: (p: PropertyFacet)=>void,
    onValuesClick: (p: PropertyFacet[])=>void,
    onRemoveClick: (p: PropertyFacet)=>void,
    onFacetValueContainsClick: (text: string, limit: number, property: Property) => void
}) {

    let propertyValueCount = prop.searchStateFacets ? prop.searchStateFacets.getPropertyValueCount(prop.property) : null;
    let isSelectedFacet = Tools.findFirst(prop.selectedFacets, (e) => e.property, prop.property.title) !== null;
    if (isSelectedFacet) return;

    let facetValuesDiv = useRef<any>(null);
    let wikiContext = useContext(WikiContext);
    let facetsWithOr = wikiContext.config['fsg2FacetsWithOR'].includes(prop.property.title);

    const [openOrDialog, setOpenOrDialog] = useState(false);

    const handleCloseFacetOrDialog = () => {
        setOpenOrDialog(false);
    };

    function handleExpandClick(limit: number) {
        if (propertyValueCount === null) {
            prop.onExpandClick(prop.property, limit);
            return;
        }

    }


    return <li className={'fs-facets'}>
        <span onClick={() => handleExpandClick(wikiContext.config.fsg2FacetValueLimit)}>[e]</span>
        <span onClick={() => prop.onPropertyClick(prop.property)}>{prop.property.displayTitle}</span>
        <span>({prop.propertyFacetCount?.count})</span>
        { facetsWithOr ? <span onClick={()=>{
            handleExpandClick(wikiContext.config.fsg2FacetValueLimit);
            setOpenOrDialog(true);
        } }>[OR]</span> : ''}
        <FacetOrDialog open={openOrDialog}
                       handleClose={handleCloseFacetOrDialog}
                       searchStateFacets={prop.searchStateFacets}
                       selectedFacets={prop.selectedFacets}
                       property={prop.property}
                       onValuesClick={prop.onValuesClick}
        />
         <div ref={facetValuesDiv}>
            <FacetValues propertyValueCount={propertyValueCount}
                         selectedPropertyFacet={null}
                         onValueClick={prop.onValueClick}
                         removable={false}
                         query={prop.query}
                         onRemoveClick={prop.onRemoveClick}
                         onFacetValueContainsClick={prop.onFacetValueContainsClick}
                         onExpandClick={prop.onExpandClick}
        />

        </div>
    </li>
}

function FacetView(prop: {
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    onPropertyClick: (p: Property)=>void,
    onExpandClick: (p: Property, limit: number)=>void,
    onValueClick: (p: PropertyFacet)=>void,
    onValuesClick: (p: PropertyFacet[])=>void,
    onRemoveClick: (p: PropertyFacet)=>void,
    onFacetValueContainsClick: (text: string, limit: number, property: Property) => void
}) {
    if (!prop.searchStateDocument) return;

    const propertyFacetCounts = prop.searchStateDocument.documentResponse.propertyFacetCounts;
    let wikiContext = useContext(WikiContext);
    let shownFacets = ConfigUtils.getShownFacets(wikiContext.config['fsg2ShownFacets'], prop.searchStateDocument.query);

    const listItems = propertyFacetCounts
        .filter((facetCount) => shownFacets.includes(facetCount.property.title) || shownFacets.length === 0 )
        .map((facetCount,i) => {

        return <FacetViewProperty key={facetCount.property.title+facetCount.property.type}
                           query={prop.searchStateDocument.query}
                           title={facetCount.property.title}
                           property={facetCount.property}
                           onPropertyClick={prop.onPropertyClick}
                           onExpandClick={prop.onExpandClick}
                           onValueClick={prop.onValueClick}
                           onValuesClick={prop.onValuesClick}
                           searchStateFacets={prop.searchStateFacets?.facetsResponse}
                           selectedFacets={prop.searchStateDocument.query.propertyFacets}
                           propertyFacetCount={facetCount}
                           onRemoveClick={prop.onRemoveClick}
                           onFacetValueContainsClick={prop.onFacetValueContainsClick}
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