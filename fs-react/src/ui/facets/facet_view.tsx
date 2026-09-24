import React, {Dispatch, SetStateAction, useContext} from "react";
import {SimpleTreeView} from "@mui/x-tree-view";
import {Typography} from "@mui/material";
import {createPortal} from "react-dom";
import {SearchStateDocument, SearchStateFacet} from "app/common/datatypes";
import EventHandler from "app/common/event_handler";
import Client from "app/common/client";
import {WikiContext} from "app/index";
import FacetOrDialog, {ORDialogInput} from "app/ui/or-dialog/facet_or_dialog";
import {DateRangeDialogInput} from "app/ui/date-dialog/date_range_dialog_input";
import ConfigUtils from "app/util/config_utils";
import FacetViewProperty from "app/ui/facets/facet";
import FacetExtensionPoint from "app/extensions/facet_ep";
import CustomTreeItem from "app/custom_ui/custom_tree_item";
import FacetWithCount from "app/ui/common/facet_with_count";
import DateRangeDialog from "app/ui/date-dialog/date_range_dialog";


function FacetView(prop: {
    client: Client
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    expandedFacets: string[],
    eventHandler: EventHandler
    setLoadPromise: Dispatch<SetStateAction<Promise<any>>>

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
        prop.client,
        prop.setLoadPromise
    );

    const [openDateRangeDialog, handleCloseFacetDateRangeDialog, onDateRangeDialogClick] = DateRangeDialogInput.createDateRangeDialogState(
        prop.searchStateDocument.query,
        prop.client,
        prop.setLoadPromise
    );


    const listItems = propertyFacetCounts
        .filter((facetCount) => shownProperties.containsOrEmpty(facetCount.property.title))
        .filter((facetCount) => facetCount.property.title !== wikiContext.config['fs2gTagCloudProperty'])
        .sort(ConfigUtils.getSortFunction(wikiContext.options['fs2-sort-order-preferences']))
        .map((facetCount) => {

        return <FacetViewProperty key={facetCount.property.title+facetCount.property.type}
                           searchStateDocument={prop.searchStateDocument}
                           searchStateFacets={prop.searchStateFacets}
                           facetResponse={prop.searchStateFacets?.facetsResponse}
                           propertyFacetCount={facetCount}
                           eventHandler={prop.eventHandler}
                           onOrDialogClick={onOrDialogClick}
                           onDateRangeDialog={onDateRangeDialogClick}

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
                                     facetResponse={openOrDialog.facetResponse}
                                     baseQuery={prop.searchStateDocument.query}
                                     property={openOrDialog.property}
                                     eventHandler={prop.eventHandler}
        />, document.body)}
        {createPortal(<DateRangeDialog open={openDateRangeDialog.open}
                                     handleClose={handleCloseFacetDateRangeDialog}
                                     facetResponse={openDateRangeDialog.facetResponse}
                                     property={openDateRangeDialog.property}
                                     eventHandler={prop.eventHandler}
        />, document.body)}

    </div>;
}

export default FacetView;