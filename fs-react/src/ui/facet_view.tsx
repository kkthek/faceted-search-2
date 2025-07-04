import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {
    BaseQuery,
    FacetResponse,
    Property,
    PropertyFacet,
    PropertyFacetCount,
    PropertyWithURL
} from "../common/datatypes";
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
import QueryUtils from "../util/query_utils";
import FacetExtensionPoint from "../extensions/facet_ep";

function FacetViewProperty(prop: {
    query: BaseQuery,
    title: string,
    property: PropertyWithURL,
    searchStateFacets: FacetResponse,
    selectedFacets: PropertyFacet[],
    propertyFacetCount: PropertyFacetCount|null,
    eventHandler: EventHandler
    onOrDialogClick: (property: Property) => void
}) {

    let propertyValueCount = prop.searchStateFacets ? prop.searchStateFacets.getPropertyValueCount(prop.property) : null;
    let isSelectedFacet = Tools.findFirst(prop.selectedFacets, (e) => e.property.title, prop.property.title) !== null;
    if (isSelectedFacet) return;


    let wikiContext = useContext(WikiContext);
    let facetsWithOr = wikiContext.config['fs2gFacetsWithOR'].includes(prop.property.title);

    const values = propertyValueCount?.values.map((v, i) => {
        return <FacetValues key={prop.property.title + i}
                     propertyValueCount={v}
                     property={prop.property}
                     eventHandler={prop.eventHandler}
                     removable={false}
                     query={prop.query}
                     index={i}
        />
    });

    let showAll = propertyValueCount?.values.length === wikiContext.config.fs2gFacetValueLimit &&
                !(prop.property.isRangeProperty() || prop.property.isBooleanProperty());

    return <CustomTreeItem itemId={Tools.createItemIdForProperty(prop.property)}
                           label={prop.property.displayTitle + " ("+prop.propertyFacetCount?.count+")"}
                           itemAction={() => {
                               prop.eventHandler.onPropertyClick(prop.property);

                           } }
                           actionIcon={facetsWithOr ? ChecklistIcon : null}
                           action={() => {
                               prop.onOrDialogClick(prop.property);
                           } }
                     className={'fs-facets'}>
        <FacetFilter eventHandler={prop.eventHandler}
                     numberOfValues={propertyValueCount?.values.length}
                     property={propertyValueCount?.property}/>

        {values}
        { showAll ?
        <CustomTreeItem itemId={prop.property.title + "-showall"}
                        label={"[Show all...]"}
                        itemAction={() => {
                            prop.eventHandler.onShowAllValues(prop.property);
                        }
                        }
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
    let wikiContext = useContext(WikiContext);
    let shownFacets = ConfigUtils.getShownFacets(wikiContext.config['fs2gShownFacets'], prop.searchStateDocument.query);

    const [openOrDialog, setOpenOrDialog] = useState<ORDialogInput>(new ORDialogInput());

    const handleCloseFacetOrDialog = () => {
        setOpenOrDialog(new ORDialogInput());
    };


    const onOrDialogClick = function(p: Property) {

        let query = QueryUtils.prepareQueryWithoutFacet(prop.searchStateDocument.query, p);
        prop.client.searchFacets(query).then((facetResponse) => {
            setOpenOrDialog(new ORDialogInput(true, p, facetResponse));
        });
    }

    const listItems = propertyFacetCounts
        .filter((facetCount) => shownFacets.includes(facetCount.property.title) || shownFacets.length === 0 )
        .sort(ConfigUtils.getSortFunctionForPropertyFacets(wikiContext.options['fs2-sort-order-preferences']))
        .map((facetCount,i) => {

        return <FacetViewProperty key={facetCount.property.title+facetCount.property.type}
                           query={prop.searchStateDocument.query}
                           title={facetCount.property.title}
                           property={facetCount.property}
                           searchStateFacets={prop.searchStateFacets?.facetsResponse}
                           selectedFacets={prop.searchStateDocument.query.propertyFacets}
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

        let facetCount = Tools.findFirstByPredicate(propertyFacetCounts,
           (pfc) => Tools.createItemIdForProperty(pfc.property)=== itemId);
        if (isExpanded) {
            prop.eventHandler.onExpandFacetClick(facetCount.property);
        } else {
            prop.eventHandler.onCollapseFacetClick(facetCount.property.getItemId());
        }

    };


    return <div id={'fs-facetview'}>
        <Typography>{wikiContext.msg('fs-available-properties')}</Typography>
        <SimpleTreeView expansionTrigger={'iconContainer'}
                        disableSelection
                        disabledItemsFocusable
                        expandedItems={prop.expandedFacets}
                        onItemExpansionToggle={handleItemExpansionToggle}
        >
            {listItems}
            {listItems.length === 0 ? <CustomTreeItem itemId={'none'} label={'none'}></CustomTreeItem>: ''}
        </SimpleTreeView>
        <FacetExtensionPoint key={'facetExtensionPoint'}
                             client={prop.client}
                             searchStateDocument={prop.searchStateDocument}
                             searchStateFacets={prop.searchStateFacets}
                             expandedFacets={prop.expandedFacets}
                             eventHandler={prop.eventHandler}
        />
        <FacetOrDialog open={openOrDialog.open}
                       client={prop.client}
                       handleClose={handleCloseFacetOrDialog}
                       searchStateFacets={openOrDialog.facetResponse}
                       selectedFacets={prop.searchStateDocument.query.propertyFacets}
                       property={openOrDialog.property}
                       eventHandler={prop.eventHandler}
        />
    </div>;
}

export default FacetView;