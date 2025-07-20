import React, {useContext, useState} from "react";
import {Property, PropertyFacetCount, PropertyValueCount,} from "../common/datatypes";
import EventHandler, {SearchStateDocument, SearchStateFacet} from "../common/event_handler";
import {SimpleTreeView} from "@mui/x-tree-view";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectedFacetValues from "./selected_facet_values_view";
import ChecklistIcon from "@mui/icons-material/Checklist";
import Client from "../common/client";
import FacetOrDialog, {ORDialogInput} from "./facet_or_dialog";
import {WikiContext} from "../index";
import QueryUtils from "../util/query_utils";
import Tools from "../util/tools";
import FacetWithCount from "./facet_with_count";

function SelectedFacets(prop: {
    propertyValueCount: PropertyValueCount
    facetCount: PropertyFacetCount
    searchStateFacet: SearchStateFacet,
    eventHandler: EventHandler
    onOrDialogClick: (property: Property) => void

}) {
    let query = prop.searchStateFacet.query;

    let propertyFacet = query.findPropertyFacet(prop.propertyValueCount.property);
    if (!propertyFacet) return;
    let hasValue = propertyFacet.hasValueOrMWTitle() || propertyFacet.hasRange();
    let wikiContext = useContext(WikiContext);
    let facetsWithOr = wikiContext.config['fs2gFacetsWithOR'].includes(propertyFacet.property.title);

    const itemlist = prop.propertyValueCount.values.map((v,i ) => {

        return <SelectedFacetValues key={prop.propertyValueCount.property.title + i}
                     selectedPropertyFacet={propertyFacet}
                     propertyValueCount={v}
                     removable={hasValue}
                     eventHandler={prop.eventHandler}
                     index={i}
        />
    });

    return <CustomTreeItem key={prop.propertyValueCount.property.title}
                           itemId={Tools.createItemIdForProperty(prop.propertyValueCount.property)}
                           label={<FacetWithCount
                               displayTitle={prop.propertyValueCount.property.displayTitle}
                               count={prop.facetCount.count}
                           />}
                           action={() => {
                               if (!hasValue || itemlist.length === 0) {
                                   prop.eventHandler.onRemovePropertyFacet(propertyFacet)
                               } else if (facetsWithOr) {
                                   prop.onOrDialogClick(prop.propertyValueCount.property);
                               }

                           } }
                           actionIcon={!hasValue || itemlist.length === 0 ? DeleteIcon :  (facetsWithOr ? ChecklistIcon: null)}
            >{itemlist}</CustomTreeItem>
}

function SelectedFacetsView(prop: {
    client: Client
    searchStateFacet: SearchStateFacet,
    searchStateDocument: SearchStateDocument,
    expandedFacets: string[],
    eventHandler: EventHandler
}) {
    if (!prop.searchStateFacet) return;

    const [openOrDialog, handleCloseFacetOrDialog, onOrDialogClick] = ORDialogInput.createORDialogState(
        prop.searchStateFacet.query,
        prop.client
    );

    const propertyFacetCounts = prop.searchStateDocument?.documentResponse.propertyFacetCounts;
    const facetValues = prop.searchStateFacet.facetsResponse.valueCounts.map((v, i) => {

            let query = prop.searchStateFacet.query;
            let isSelectedFacet = query.isPropertyFacetSelected(v.property);
            if (!isSelectedFacet) return;
            if (!propertyFacetCounts) return;
            const facetCount = Tools.findFirstByPredicate(propertyFacetCounts, p => p.property.title === v.property.title);
            return <SelectedFacets key={v.property.title}
                                   propertyValueCount={v}
                                   facetCount={facetCount}
                                   searchStateFacet={prop.searchStateFacet}
                                   eventHandler={prop.eventHandler}
                                   onOrDialogClick={onOrDialogClick}/>
        }
    );

    let onItemExpansionToggle = function(event: React.SyntheticEvent | null, itemId: string, isExpanded: boolean) {
        if (isExpanded) {
            prop.eventHandler.onExpandSelectedFacetClick(itemId)
        } else {
            prop.eventHandler.onCollapseFacetClick(itemId)
        }
    }

    return <div>
        <SimpleTreeView
            expandedItems={prop.expandedFacets}
            expansionTrigger={'iconContainer'} disableSelection
            onItemExpansionToggle={onItemExpansionToggle}
        >
            {facetValues}
        </SimpleTreeView>

        <FacetOrDialog open={openOrDialog.open}
                       handleClose={handleCloseFacetOrDialog}
                       searchStateFacets={openOrDialog.facetResponse}
                       selectedFacets={prop.searchStateFacet.query.propertyFacets}
                       property={openOrDialog.property}
                       eventHandler={prop.eventHandler}
                       client={prop.client}
        />
    </div>;
}

export default SelectedFacetsView;