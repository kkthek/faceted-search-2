import React from "react";
import {Property, PropertyFacet, PropertyValueCount,} from "../common/datatypes";
import FacetValues from "./facet_values_view";
import {SearchStateFacet} from "./event_handler";
import {SimpleTreeView, TreeItem} from "@mui/x-tree-view";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectedFacetValues from "./selected_facet_values_view";

function SelectedFacets(prop: {
    propertyValueCount: PropertyValueCount
    searchStateFacet: SearchStateFacet,
    onValueClick: (p: PropertyFacet) => void,
    onRemoveClick: (p: PropertyFacet) => void,
    onExpandClick: (p: Property, limit: number)=>void,
    onFacetValueContainsClick: (text: string, limit: number, property: Property) => void
}) {
    let query = prop.searchStateFacet.query;

    let propertyFacet = query.findPropertyFacet(prop.propertyValueCount.property);
    if (!propertyFacet) return;
    let hasValue = propertyFacet.hasValue() || propertyFacet.hasRange();


    const itemlist = prop.propertyValueCount.values.map((v,i ) => {

        return <SelectedFacetValues key={prop.propertyValueCount.property.title + i}
                     query={prop.searchStateFacet.query}
                     selectedPropertyFacet={propertyFacet}
                     propertyValueCount={v}
                     property={prop.propertyValueCount.property}
                     removable={hasValue}
                     onValueClick={prop.onValueClick}
                     onRemoveClick={prop.onRemoveClick}
                     onExpandClick={prop.onExpandClick}
                     onFacetValueContainsClick={prop.onFacetValueContainsClick}/>
    });

    return <CustomTreeItem key={prop.propertyValueCount.property.title}
                           itemId={prop.propertyValueCount.property.title}
                     label={prop.propertyValueCount.property.displayTitle}
                     action={() => prop.onRemoveClick(propertyFacet)}
                     actionIcon={!hasValue ? DeleteIcon : null}
            >{itemlist}</CustomTreeItem>
}

function SelectedFacetsView(prop: {
    searchStateFacet: SearchStateFacet,
    onValueClick: (p: PropertyFacet) => void,
    onRemoveClick: (p: PropertyFacet) => void,
    onExpandClick: (p: Property, limit: number)=>void,
    onFacetValueContainsClick: (text: string, limit: number, property: Property) => void
}) {
    if (!prop.searchStateFacet) return;

    let expandedProperties: string[] = [];
    const facetValues = prop.searchStateFacet.facetsResponse.valueCounts.map((v, i) => {

            let query = prop.searchStateFacet.query;
            let isSelectedFacet = query.isPropertyFacetSelected(v.property);

            if (!isSelectedFacet) return;
            expandedProperties.push(v.property.title);
            return <SelectedFacets key={v.property.title}
                                    propertyValueCount={v}
                                   searchStateFacet={prop.searchStateFacet}
                                   onValueClick={prop.onValueClick}
                                   onRemoveClick={prop.onRemoveClick}
                                   onExpandClick={prop.onExpandClick}
                                   onFacetValueContainsClick={prop.onFacetValueContainsClick}/>
        }
    );


    return <SimpleTreeView
        expandedItems={expandedProperties}
        expansionTrigger={'iconContainer'} disableSelection>
            {facetValues}
    </SimpleTreeView>;
}

export default SelectedFacetsView;