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

function FacetViewProperty(prop: {
    query: BaseQuery,
    title: string,
    property: PropertyWithURL,
    searchStateFacets: FacetResponse,
    selectedFacets: PropertyFacet[],
    expandedFacets: [string[], Dispatch<SetStateAction<string[]>>],
    propertyFacetCount: PropertyFacetCount|null,
    eventHandler: EventHandler
    onOrDialogClick: (property: Property) => void
}) {
    const [expandedFacets, setExpandedFacets] = prop.expandedFacets;
    let propertyValueCount = prop.searchStateFacets ? prop.searchStateFacets.getPropertyValueCount(prop.property) : null;
    let isSelectedFacet = Tools.findFirst(prop.selectedFacets, (e) => e.property, prop.property.title) !== null;
    if (isSelectedFacet) return;


    let wikiContext = useContext(WikiContext);
    let facetsWithOr = wikiContext.config['fs2gFacetsWithOR'].includes(prop.property.title);

    const values = propertyValueCount?.values.map((v, i) => {
        return <FacetValues key={prop.property.title + i}
                     propertyValueCount={v}
                     expandedFacets={prop.expandedFacets}
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
                               setExpandedFacets([...expandedFacets, prop.property.title]);
                           } }
                           actionIcon={facetsWithOr ? ChecklistIcon : null}
                           action={() => {
                               prop.onOrDialogClick(prop.property);
                           } }
                     className={'fs-facets'}>
        <FacetFilter onFilterContainsClick={prop.eventHandler.onFacetValueContains}
                     numberOfValues={propertyValueCount?.values.length}
                     property={propertyValueCount?.property}/>

        {values}
        { showAll ?
        <CustomTreeItem itemId={prop.property.title + "-showall"}
                        label={"[Show all...]"}
                        itemAction={() => {
                            prop.eventHandler.onFacetValueContains('', null, prop.property);
                        }
                        }
        /> : '' }


    </CustomTreeItem>
}

function FacetView(prop: {
    client: Client
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    expandedFacets: [string[], Dispatch<SetStateAction<string[]>>],
    eventHandler: EventHandler

}) {
    if (!prop.searchStateDocument) return;

    const [expandedFacets, setExpandedFacets] = prop.expandedFacets;
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

    let onExpandClick = prop.eventHandler.onExpandClick.bind(prop.eventHandler);

    const listItems = propertyFacetCounts
        .filter((facetCount) => shownFacets.includes(facetCount.property.title) || shownFacets.length === 0 )
        .sort(ConfigUtils.getSortFunctionForPropertyFacets(wikiContext.options['fs2-sort-order-preferences']))
        .map((facetCount,i) => {

        return <FacetViewProperty key={facetCount.property.title+facetCount.property.type}
                           query={prop.searchStateDocument.query}
                           title={facetCount.property.title}
                           property={facetCount.property}
                           expandedFacets={prop.expandedFacets}
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

        if (isExpanded) {
            let facetCount = Tools.findFirstByPredicate(propertyFacetCounts,
                (pfc) => Tools.createItemIdForProperty(pfc.property)=== itemId);
            onExpandClick(facetCount.property, wikiContext.config.fs2gFacetValueLimit);
        }

        setExpandedFacets(isExpanded ? [...expandedFacets, itemId] : expandedFacets.filter(i => i !== itemId));
    };


    return <div id={'fs-facetview'}>
        <Typography>{wikiContext.msg('fs-available-properties')}</Typography>
        <SimpleTreeView expansionTrigger={'iconContainer'}
                        disableSelection
                        disabledItemsFocusable
                        expandedItems={expandedFacets}
                        onItemExpansionToggle={handleItemExpansionToggle}
        >
            {listItems}
        </SimpleTreeView>
        <FacetOrDialog open={openOrDialog.open}
                       handleClose={handleCloseFacetOrDialog}
                       expandedFacets={prop.expandedFacets}
                       searchStateFacets={openOrDialog.facetResponse}
                       selectedFacets={prop.searchStateDocument.query.propertyFacets}
                       property={openOrDialog.property}
                       eventHandler={prop.eventHandler}
        />
    </div>;
}

export default FacetView;