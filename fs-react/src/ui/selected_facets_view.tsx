import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {Property, PropertyValueCount,} from "../common/datatypes";
import EventHandler, {SearchStateFacet} from "../common/event_handler";
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

function SelectedFacets(prop: {
    propertyValueCount: PropertyValueCount
    searchStateFacet: SearchStateFacet,
    eventHandler: EventHandler
    onOrDialogClick: (property: Property) => void

}) {
    let query = prop.searchStateFacet.query;

    let propertyFacet = query.findPropertyFacet(prop.propertyValueCount.property);
    if (!propertyFacet) return;
    let hasValue = propertyFacet.hasValue() || propertyFacet.hasRange();
    let wikiContext = useContext(WikiContext);
    let facetsWithOr = wikiContext.config['fs2gFacetsWithOR'].includes(propertyFacet.property);


    const itemlist = prop.propertyValueCount.values.map((v,i ) => {

        return <SelectedFacetValues key={prop.propertyValueCount.property.title + i}
                     query={prop.searchStateFacet.query}
                     selectedPropertyFacet={propertyFacet}
                     propertyValueCount={v}
                     property={prop.propertyValueCount.property}
                     removable={hasValue}
                     eventHandler={prop.eventHandler}
                     index={i}
        />
    });

    return <CustomTreeItem key={prop.propertyValueCount.property.title}
                           itemId={Tools.createItemIdForProperty(prop.propertyValueCount.property)}
                           label={prop.propertyValueCount.property.displayTitle}
                           action={() => {
                               if (!hasValue) {
                                   prop.eventHandler.onRemovePropertyFacet(propertyFacet)
                               } else if (facetsWithOr) {
                                   prop.onOrDialogClick(prop.propertyValueCount.property);
                               }

                           } }
                           actionIcon={!hasValue ? DeleteIcon :  (facetsWithOr ? ChecklistIcon: null)}
            >{itemlist}</CustomTreeItem>
}

function SelectedFacetsView(prop: {
    client: Client
    searchStateFacet: SearchStateFacet,
    expandedFacets: string[],
    eventHandler: EventHandler
}) {
    if (!prop.searchStateFacet) return;

    const [openOrDialog, setOpenOrDialog] = useState<ORDialogInput>(new ORDialogInput());

    const handleCloseFacetOrDialog = () => {
        setOpenOrDialog(new ORDialogInput());
    };

    const onOrDialogClick = function(p: Property) {
        let query = QueryUtils.prepareQueryWithoutFacet(prop.searchStateFacet.query, p);
        prop.client.searchFacets(query).then((facetResponse) => {
            setOpenOrDialog(new ORDialogInput(true, p, facetResponse));
        });
    }


    const facetValues = prop.searchStateFacet.facetsResponse.valueCounts.map((v, i) => {

            let query = prop.searchStateFacet.query;
            let isSelectedFacet = query.isPropertyFacetSelected(v.property);
            if (!isSelectedFacet) return;

            return <SelectedFacets key={v.property.title}
                                   propertyValueCount={v}
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
        />
    </div>;
}

export default SelectedFacetsView;