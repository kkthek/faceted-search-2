import React, {useContext, useState} from "react";
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
import {SearchStateDocument, SearchStateFacet} from "./event_handler";
import {WikiContext} from "../index";
import ConfigUtils from "../util/config_utils";
import FacetOrDialog from "./facet_or_dialog";
import {SimpleTreeView} from "@mui/x-tree-view";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import ChecklistIcon from '@mui/icons-material/Checklist';
import FacetFilter from "./facet_filter";
import {Typography} from "@mui/material";

function FacetViewProperty(prop: {
    query: BaseQuery,
    title: string,
    property: PropertyWithURL,
    searchStateFacets: FacetResponse,
    selectedFacets: PropertyFacet[],
    propertyFacetCount: PropertyFacetCount|null,
    onPropertyClick: (p: Property)=>void,
    onExpandClick: (p: Property, limit: number)=>void,
    onValueClick: (p: PropertyFacet)=>void,
    onValuesClick: (p: PropertyFacet[])=>void,
    onRemoveClick: (p: PropertyFacet)=>void,
    onFacetValueContainsClick: (text: string, limit: number, property: Property) => void,
    onOrDialogClick: (property: Property) => void
}) {

    let propertyValueCount = prop.searchStateFacets ? prop.searchStateFacets.getPropertyValueCount(prop.property) : null;
    let isSelectedFacet = Tools.findFirst(prop.selectedFacets, (e) => e.property, prop.property.title) !== null;
    if (isSelectedFacet) return;


    let wikiContext = useContext(WikiContext);
    let facetsWithOr = wikiContext.config['fs2gFacetsWithOR'].includes(prop.property.title);

    function handleExpandClick(limit: number) {
        if (propertyValueCount === null) {
            prop.onExpandClick(prop.property, limit);
            return;
        }

    }

    const values = propertyValueCount?.values.map((v, i) => {
        return <FacetValues key={prop.property.title + i}
                     propertyValueCount={v}
                     property={prop.property}
                     onValueClick={prop.onValueClick}
                     removable={false}
                     query={prop.query}
                     onRemoveClick={prop.onRemoveClick}
        />
    });

    let showAll = propertyValueCount?.values.length <= wikiContext.config.fs2gFacetValueLimit &&
                !(prop.property.isRangeProperty() || prop.property.isBooleanProperty());

    return <CustomTreeItem itemId={prop.property.title}
                           label={prop.property.displayTitle + " ("+prop.propertyFacetCount?.count+")"}
                           itemAction={() => prop.onPropertyClick(prop.property)}
                           actionIcon={facetsWithOr ? ChecklistIcon : null}
                           action={() => {

                               handleExpandClick(null);
                               prop.onOrDialogClick(prop.property);
                           } }
                     className={'fs-facets'}>
        <FacetFilter onFilterContainsClick={prop.onFacetValueContainsClick}
                     numberOfValues={propertyValueCount?.values.length}
                     property={propertyValueCount?.property}/>

        {values}
        { showAll ?
        <CustomTreeItem itemId={prop.property.title + "-showall"}
                        label={"[Show all...]"}
                        itemAction={() => {
                            prop.onFacetValueContainsClick('', null, prop.property);
                        }
                        }
        /> : '' }


    </CustomTreeItem>
}

function FacetView(prop: {
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    onPropertyClick: (p: Property)=>void,
    onExpandClick: (p: Property, limit: number)=>void,
    onValueClick: (p: PropertyFacet)=>void,
    onValuesClick: (p: PropertyFacet[])=>void,
    onRemoveClick: (p: PropertyFacet)=>void,
    onFacetValueContainsClick: (text: string, limit: number, property: Property) => void
}) {
    if (!prop.searchStateDocument) return;

    const propertyFacetCounts = prop.searchStateDocument.documentResponse.propertyFacetCounts;
    let wikiContext = useContext(WikiContext);
    let shownFacets = ConfigUtils.getShownFacets(wikiContext.config['fs2gShownFacets'], prop.searchStateDocument.query);

    const propertyMap: any = {};
    propertyFacetCounts.forEach((pfc) => {
        propertyMap[pfc.property.title] = pfc.property;
    });

    const [openOrDialog, setOpenOrDialog] = useState({ open: false, property: null});

    const handleCloseFacetOrDialog = () => {
        setOpenOrDialog({ open: false, property: null});
    };


    const onOrDialogClick = function(p: Property) {
        setOpenOrDialog({ open: true, property: p});
    }

    const listItems = propertyFacetCounts
        .filter((facetCount) => shownFacets.includes(facetCount.property.title) || shownFacets.length === 0 )
        .map((facetCount,i) => {

        return <FacetViewProperty key={facetCount.property.title+facetCount.property.type}
                           query={prop.searchStateDocument.query}
                           title={facetCount.property.title}
                           property={facetCount.property}
                           onPropertyClick={prop.onPropertyClick}
                           onExpandClick={prop.onExpandClick}
                           onValueClick={prop.onValueClick}
                           onValuesClick={prop.onValuesClick}
                           searchStateFacets={prop.searchStateFacets?.facetsResponse}
                           selectedFacets={prop.searchStateDocument.query.propertyFacets}
                           propertyFacetCount={facetCount}
                           onRemoveClick={prop.onRemoveClick}
                           onFacetValueContainsClick={prop.onFacetValueContainsClick}
                           onOrDialogClick={onOrDialogClick}
        />
    }
    );

    const handleItemExpansionToggle = (
        event: React.SyntheticEvent | null,
        itemId: string,
        isExpanded: boolean,
    ) => {
        if (!propertyMap[itemId]) return;
        prop.onExpandClick(propertyMap[itemId], wikiContext.config.fs2gFacetValueLimit);
    };

    const handleItemClick = (
        event: React.SyntheticEvent | null,
        itemId: string
    ) => {
        if (!propertyMap[itemId]) return;
        let target = event.target as any;
        if (!target.classList.contains('MuiTreeItem-label')) return;
        prop.onPropertyClick(propertyMap[itemId])
    };

    return <div id={'fs-facetview'}>
        <Typography>Available properties</Typography>
        <SimpleTreeView expansionTrigger={'iconContainer'} disableSelection disabledItemsFocusable
                        onItemExpansionToggle={handleItemExpansionToggle}
                        onItemClick={handleItemClick}
        >
            {listItems}
        </SimpleTreeView>
        <FacetOrDialog open={openOrDialog.open}
                       handleClose={handleCloseFacetOrDialog}
                       searchStateFacets={prop.searchStateFacets?.facetsResponse}
                       selectedFacets={prop.searchStateDocument.query.propertyFacets}
                       property={openOrDialog.property}
                       onValuesClick={prop.onValuesClick}
        />
    </div>;
}

export default FacetView;