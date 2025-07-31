import React, {useContext} from "react";
import {FacetResponse, Property, PropertyFacetCount} from "../common/datatypes";
import Tools from "../util/tools";
import FacetValues from "./facet_values_view";
import EventHandler, {SearchStateDocument, SearchStateFacet} from "../common/event_handler";
import {WikiContext} from "../index";
import ConfigUtils from "../util/config_utils";
import FacetOrDialog, {ORDialogInput} from "./facet_or_dialog";
import {SimpleTreeView} from "@mui/x-tree-view";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import ChecklistIcon from '@mui/icons-material/Checklist';
import FacetFilter from "./facet_filter";
import {Typography} from "@mui/material";
import Client from "../common/client";
import FacetExtensionPoint from "../extensions/facet_ep";
import FacetWithCount from "./facet_with_count";

function FacetViewProperty(prop: {
    searchStateDocument: SearchStateDocument,
    searchStateFacets: FacetResponse,
    propertyFacetCount: PropertyFacetCount,
    eventHandler: EventHandler
    onOrDialogClick: (property: Property) => void
}) {

    const property =  prop.propertyFacetCount.property;
    const propertyValueCount = prop.searchStateFacets?.getPropertyValueCount(property);
    const isSelectedFacet = prop.searchStateDocument.query.findPropertyFacet(property) !== null;
    if (isSelectedFacet) return;

    const wikiContext = useContext(WikiContext);
    const facetsWithOr = wikiContext.config['fs2gFacetsWithOR'].includes(property.title);

    const values = propertyValueCount?.values.map((v, i) => {
        return <FacetValues key={property.title + i}
                     propertyValueCount={v}
                     property={property}
                     eventHandler={prop.eventHandler}
        />
    });

    const showAll = propertyValueCount?.values.length === wikiContext.config.fs2gFacetValueLimit &&
                !(property.isRangeProperty() || property.isBooleanProperty());

    return <CustomTreeItem itemId={Tools.createItemIdForProperty(property)}
                           label={<FacetWithCount displayTitle={property.displayTitle} count={prop.propertyFacetCount?.count}/>}
                           itemAction={() => prop.eventHandler.onPropertyClick(property)}
                           actionIcon={facetsWithOr ? ChecklistIcon : null}
                           action={() => prop.onOrDialogClick(property)}
                           className={'fs-facets'}>
        <FacetFilter eventHandler={prop.eventHandler}
                     numberOfValues={propertyValueCount?.values.length}
                     property={propertyValueCount?.property}/>

        {values}
        { showAll ?
        <CustomTreeItem itemId={property.title + "-showall"}
                        label={"["+wikiContext.msg('fs-show-all')+"]"}
                        itemAction={() => prop.eventHandler.onShowAllValues(property)}
        /> : '' }


    </CustomTreeItem>
}

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
        .filter((facetCount) => shownFacets.includes(facetCount.property.title) || shownFacets.length === 0 )
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