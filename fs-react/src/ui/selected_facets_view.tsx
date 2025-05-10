import React, {useContext, useState} from "react";
import {Property, PropertyFacet, PropertyValueCount,} from "../common/datatypes";
import {SearchStateFacet} from "../common/event_handler";
import {SimpleTreeView} from "@mui/x-tree-view";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectedFacetValues from "./selected_facet_values_view";
import ChecklistIcon from "@mui/icons-material/Checklist";
import Client from "../common/client";
import FacetOrDialog, {ORDialogInput} from "./facet_or_dialog";
import {WikiContext} from "../index";
import QueryUtils from "../util/query_utils";

function SelectedFacets(prop: {
    propertyValueCount: PropertyValueCount
    searchStateFacet: SearchStateFacet,
    onValueClick: (p: PropertyFacet) => void,
    onRemoveClick: (p: PropertyFacet) => void,
    onExpandClick: (p: Property, limit: number)=>void,
    onOrDialogClick: (property: Property) => void
    onFacetValueContainsClick: (text: string, limit: number, property: Property) => void
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
                     onValueClick={prop.onValueClick}
                     onRemoveClick={prop.onRemoveClick}
                     onExpandClick={prop.onExpandClick}
                     onFacetValueContainsClick={prop.onFacetValueContainsClick}/>
    });

    return <CustomTreeItem key={prop.propertyValueCount.property.title}
                           itemId={prop.propertyValueCount.property.title}
                           label={prop.propertyValueCount.property.displayTitle}
                           action={() => {
                               if (!hasValue) {
                                   prop.onRemoveClick(propertyFacet)
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
    onValueClick: (p: PropertyFacet) => void,
    onValuesClick: (p: PropertyFacet[])=>void,
    onRemoveClick: (p: PropertyFacet) => void,
    onExpandClick: (p: Property, limit: number)=>void,
    onFacetValueContainsClick: (text: string, limit: number, property: Property) => void
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

    let expandedProperties: string[] = [];
    const facetValues = prop.searchStateFacet.facetsResponse.valueCounts.map((v, i) => {

            let query = prop.searchStateFacet.query;

            let isSelectedFacet = query.isPropertyFacetSelected(v.property);

            if (!isSelectedFacet) return;
            expandedProperties.push(v.property.title);
            return <SelectedFacets key={v.property.title}
                                    propertyValueCount={v}
                                   searchStateFacet={prop.searchStateFacet}
                                   onValueClick={prop.onValueClick}
                                   onRemoveClick={prop.onRemoveClick}
                                   onExpandClick={prop.onExpandClick}
                                   onFacetValueContainsClick={prop.onFacetValueContainsClick}
                                   onOrDialogClick={onOrDialogClick}/>
        }
    );


    return <div>
        <SimpleTreeView
            expandedItems={expandedProperties}
            expansionTrigger={'iconContainer'} disableSelection>
            {facetValues}
        </SimpleTreeView>
        <FacetOrDialog open={openOrDialog.open}
                       handleClose={handleCloseFacetOrDialog}
                       searchStateFacets={openOrDialog.facetResponse}
                       selectedFacets={prop.searchStateFacet.query.propertyFacets}
                       property={openOrDialog.property}
                       onValuesClick={prop.onValuesClick}
        />
    </div>;
}

export default SelectedFacetsView;