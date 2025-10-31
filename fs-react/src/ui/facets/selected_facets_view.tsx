import React from "react";
import EventHandler, {SearchStateDocument, SearchStateFacet} from "../../common/event_handler";
import {SimpleTreeView} from "@mui/x-tree-view";
import Client from "../../common/client";
import FacetOrDialog, {ORDialogInput} from "../or-dialog/facet_or_dialog";
import SelectedFacet from "./selected_facet";


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

    const documentResponse = prop.searchStateDocument?.documentResponse
    const valueCounts = prop.searchStateFacet.facetsResponse.valueCounts;
    const query = prop.searchStateFacet.query;
    const facets = valueCounts.map((v, i) => {

            let isSelectedFacet = query.isPropertyFacetSelected(v.property);
            if (!isSelectedFacet) return;
            if (!documentResponse) return;
            const facetCount = documentResponse.getPropertyFacetCount(v.property);
            return <SelectedFacet key={v.property.title}
                                  propertyValueCount={v}
                                  facetCount={facetCount}
                                  searchStateFacet={prop.searchStateFacet}
                                  eventHandler={prop.eventHandler}
                                  onOrDialogClick={onOrDialogClick}/>
        }
    );

    let onItemExpansionToggle = function(
        event: React.SyntheticEvent | null,
        itemId: string,
        isExpanded: boolean) {

        if (isExpanded) {
            prop.eventHandler.onExpandSelectedFacetClick(itemId)
        } else {
            prop.eventHandler.onCollapseFacetClick(itemId)
        }
    }

    return <div>
        <SimpleTreeView
            expandedItems={prop.expandedFacets}
            expansionTrigger={'iconContainer'}
            disableSelection
            disabledItemsFocusable
            onItemExpansionToggle={onItemExpansionToggle}
            onItemFocus={(e, itemId) => {
                const input = document.getElementById(`${itemId}-input`);
                if (input) input.focus();
            }}
        >
            {facets}
        </SimpleTreeView>

        <FacetOrDialog open={openOrDialog.open}
                       handleClose={handleCloseFacetOrDialog}
                       searchStateFacets={openOrDialog.facetResponse}
                       baseQuery={prop.searchStateFacet.query}
                       property={openOrDialog.property}
                       eventHandler={prop.eventHandler}
                       client={prop.client}
        />
    </div>;
}

export default SelectedFacetsView;