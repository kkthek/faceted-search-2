import React, {useContext} from "react";
import EventHandler, {SearchStateDocument, SearchStateFacet} from "../../common/event_handler";
import {WikiContext} from "../../index";
import ConfigUtils from "../../util/config_utils";
import FacetOrDialog, {ORDialogInput} from "../or-dialog/facet_or_dialog";
import {SimpleTreeView} from "@mui/x-tree-view";
import CustomTreeItem from "../../custom_ui/custom_tree_item";
import {Typography} from "@mui/material";
import Client from "../../common/client";
import FacetExtensionPoint from "../../extensions/facet_ep";
import FacetWithCount from "../common/facet_with_count";
import FacetViewProperty from "./facet";


function FacetView(prop: {
    client: Client
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    expandedFacets: string[],
    eventHandler: EventHandler

}) {
    if (!prop.searchStateDocument) return;

    const propertyFacetCounts = prop.searchStateDocument.documentResponse.propertyFacetCounts;
    const wikiContext = useContext(WikiContext);
    const shownFacets = ConfigUtils.getShownFacets(wikiContext.config['fs2gShownFacets'], prop.searchStateDocument.query);

    const [openOrDialog, handleCloseFacetOrDialog, onOrDialogClick] = ORDialogInput.createORDialogState(
        prop.searchStateDocument.query,
        prop.client
    );

    const listItems = propertyFacetCounts
        .filter((facetCount) => shownFacets.containsOrEmpty(facetCount.property.title))
        .sort(ConfigUtils.getSortFunctionForPropertyFacets(wikiContext.options['fs2-sort-order-preferences']))
        .map((facetCount,i) => {

        return <FacetViewProperty key={facetCount.property.title+facetCount.property.type}
                           searchStateDocument={prop.searchStateDocument}
                           searchStateFacets={prop.searchStateFacets?.facetsResponse}
                           propertyFacetCount={facetCount}
                           eventHandler={prop.eventHandler}
                           onOrDialogClick={onOrDialogClick}
        />
    }
    );

    const handleItemExpansionToggle = (
        event: React.SyntheticEvent | null,
        itemId: string,
        isExpanded: boolean,
    ) => {

        let facetCount = prop.searchStateDocument.documentResponse.getPropertyFacetCountByItemId(itemId);
        if (isExpanded) {
            prop.eventHandler.onExpandFacetClick(facetCount.property);
        } else {
            prop.eventHandler.onCollapseFacetClick(itemId);
        }

    };


    return <div id={'fs-facetview'}>
        <Typography sx={{marginBottom: '15px'}}>{wikiContext.msg('fs-available-properties')}</Typography>
        <SimpleTreeView expansionTrigger={'iconContainer'}
                        disableSelection
                        disabledItemsFocusable
                        expandedItems={prop.expandedFacets}
                        onItemExpansionToggle={handleItemExpansionToggle}
                        onItemFocus={(e, itemId) => {
                            const input = document.getElementById(`${itemId}-input`);
                            if (input) input.focus();
                        }}
        >
            {listItems}
            {listItems.length === 0 ? <CustomTreeItem itemId={'none'} label={<FacetWithCount displayTitle={'none'} />} />: ''}
            <FacetExtensionPoint key={'facetExtensionPoint'}
                                 client={prop.client}
                                 searchStateDocument={prop.searchStateDocument}
                                 searchStateFacets={prop.searchStateFacets}
                                 expandedFacets={prop.expandedFacets}
                                 eventHandler={prop.eventHandler}
            />
        </SimpleTreeView>
        <FacetOrDialog open={openOrDialog.open}
                       client={prop.client}
                       handleClose={handleCloseFacetOrDialog}
                       searchStateFacets={openOrDialog.facetResponse}
                       baseQuery={prop.searchStateDocument.query}
                       property={openOrDialog.property}
                       eventHandler={prop.eventHandler}
        />
    </div>;
}

export default FacetView;