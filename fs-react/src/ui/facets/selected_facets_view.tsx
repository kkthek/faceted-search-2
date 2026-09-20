import React, {Dispatch, SetStateAction} from "react";

import {SimpleTreeView} from "@mui/x-tree-view";
import {createPortal} from "react-dom";
import Client from "app/common/client";
import {SearchStateDocument, SearchStateFacet} from "app/common/datatypes";
import EventHandler from "app/common/event_handler";
import FacetOrDialog, {ORDialogInput} from "app/ui/or-dialog/facet_or_dialog";
import SelectedFacet from "app/ui/facets/selected_facet";


function SelectedFacetsView(prop: {
    client: Client
    searchStateFacet: SearchStateFacet,
    searchStateDocument: SearchStateDocument,
    expandedFacets: string[],
    eventHandler: EventHandler
    setLoadPromise: Dispatch<SetStateAction<Promise<any>>>
}) {
    if (!prop.searchStateFacet) return;

    const [openOrDialog, handleCloseFacetOrDialog, onOrDialogClick] = ORDialogInput.createORDialogState(
        prop.searchStateFacet.query,
        prop.client,
        prop.setLoadPromise
    );

    const documentResponse = prop.searchStateDocument?.documentResponse
    const valueCounts = prop.searchStateFacet.facetsResponse.valueCounts;
    const query = prop.searchStateFacet.query;
    const facets = valueCounts.map((v) => {

            let isSelectedFacet = query.isPropertyFacetSelected(v.property);
            if (!isSelectedFacet) return;
            if (!documentResponse) return;
            const facetCount = documentResponse.getPropertyFacetCount(v.property);
            return <SelectedFacet key={v.property.title}
                                  searchStateFacets={prop.searchStateFacet}
                                  propertyValueCount={v}
                                  facetCount={facetCount}
                                  searchStateFacet={prop.searchStateFacet}
                                  eventHandler={prop.eventHandler}
                                  onOrDialogClick={onOrDialogClick}

            />
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

        {createPortal(<FacetOrDialog open={openOrDialog.open}
                       handleClose={handleCloseFacetOrDialog}
                       facetResponse={openOrDialog.facetResponse}
                       baseQuery={prop.searchStateFacet.query}
                       property={openOrDialog.property}
                       eventHandler={prop.eventHandler}
                       client={prop.client}
        />, document.body)}
    </div>;
}

export default SelectedFacetsView;