import React, {useContext} from "react";
import EventHandler from "../../common/event_handler";
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
import {SearchStateDocument, SearchStateFacet, TextFilters} from "../../common/datatypes";
import {createPortal} from "react-dom";
import DateRangeDialog from "../date-dialog/date_range_dialog";
import {DateRangeDialogInput} from "../date-dialog/date_range_dialog_input";


function FacetView(prop: {
    client: Client
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    expandedFacets: string[],
    eventHandler: EventHandler
    textFilters: TextFilters

}) {
    if (!prop.searchStateDocument) return;

    const propertyFacetCounts = prop.searchStateDocument.documentResponse.propertyFacetCounts;
    const wikiContext = useContext(WikiContext);
    const fs2gShownFacets = wikiContext.config['fs2gShownFacets'];

    let shownProperties: string[] = [];
    prop.searchStateDocument.query.categoryFacets.forEach((category) => {
        let propertiesOfCategory = fs2gShownFacets[category] || [];
        shownProperties = [...shownProperties, ...propertiesOfCategory];
    });
    shownProperties = shownProperties.createUniqueArray();

    const [openOrDialog, handleCloseFacetOrDialog, onOrDialogClick] = ORDialogInput.createORDialogState(
        prop.searchStateDocument.query,
        prop.client
    );

    const [openDateRangeDialog, handleCloseFacetDateRangeDialog, onDateRangeDialogClick] = DateRangeDialogInput.createDateRangeDialogState(
        prop.searchStateDocument.query,
        prop.client
    );


    const listItems = propertyFacetCounts
        .filter((facetCount) => shownProperties.containsOrEmpty(facetCount.property.title))
        .filter((facetCount) => facetCount.property.title !== wikiContext.config['fs2gTagCloudProperty'])
        .sort(ConfigUtils.getSortFunction(wikiContext.options['fs2-sort-order-preferences']))
        .map((facetCount) => {

        return <FacetViewProperty key={facetCount.property.title+facetCount.property.type}
                           searchStateDocument={prop.searchStateDocument}
                           searchStateFacets={prop.searchStateFacets?.facetsResponse}
                           propertyFacetCount={facetCount}
                           eventHandler={prop.eventHandler}
                           onOrDialogClick={onOrDialogClick}
                           onDateRangeDialog={onDateRangeDialogClick}
                           textFilters={prop.textFilters}
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
        <Typography variant={"subtitle1"}>{wikiContext.msg('fs-available-properties')}</Typography>
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
            {listItems.length === 0 ? <CustomTreeItem itemId={'none'} label={<FacetWithCount displayTitle={wikiContext.msg('fs-none')} />} />: ''}
            <FacetExtensionPoint key={'facetExtensionPoint'}
                                 client={prop.client}
                                 searchStateDocument={prop.searchStateDocument}
                                 searchStateFacets={prop.searchStateFacets}
                                 expandedFacets={prop.expandedFacets}
                                 eventHandler={prop.eventHandler}
            />
        </SimpleTreeView>
        {createPortal(<FacetOrDialog open={openOrDialog.open}
                                     client={prop.client}
                                     handleClose={handleCloseFacetOrDialog}
                                     searchStateFacets={openOrDialog.facetResponse}
                                     baseQuery={prop.searchStateDocument.query}
                                     property={openOrDialog.property}
                                     eventHandler={prop.eventHandler}
        />, document.body)}
        {createPortal(<DateRangeDialog open={openDateRangeDialog.open}
                                     handleClose={handleCloseFacetDateRangeDialog}
                                     searchStateFacets={openDateRangeDialog.facetResponse}
                                     property={openDateRangeDialog.property}
                                     eventHandler={prop.eventHandler}
        />, document.body)}

    </div>;
}

export default FacetView;