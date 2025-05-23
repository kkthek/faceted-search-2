import {FacetResponse, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import Tools from "../util/tools";
import DisplayTools from "../util/display_tools";
import {Checkbox, FormControlLabel, Grid, Typography} from "@mui/material";
import * as React from "react";
import {SyntheticEvent, useContext} from "react";
import {WikiContext} from "../index";
import {SimpleTreeView, TreeItem} from "@mui/x-tree-view";
import TreeCreator from "./facet_or_dialog_tree";

function FacetOrDialogContent(prop: {
    searchStateFacets: FacetResponse,
    selectedFacets: PropertyFacet[],
    property: Property,
    onChange: (e: SyntheticEvent, checked: boolean, v: ValueCount) => void,
    onBulkChange: (e: SyntheticEvent, v: ValueCount[]) => void,
    filterText: string
}) {
    let wikiContext = useContext(WikiContext);
    let valueCounts = prop.searchStateFacets?.getPropertyValueCount(prop.property).values;
    let filterTextsLowercase = prop.filterText.toLowerCase().split(/\s+/);

    valueCounts = valueCounts.filter((v) => {
        let serializedFacetValue = DisplayTools.serializeFacetValue(prop.property, v);
        return filterTextsLowercase.length === 0 ||
            filterTextsLowercase.every((s) => serializedFacetValue.toLowerCase().indexOf(s) > -1);

    });

    if (prop.property.isRangeProperty() || prop.property.isBooleanProperty()) {
        return <Grid container spacing={2}>
            <Typography>Properties of type "datetime", "number" or "boolean" cannot be used with OR</Typography>
        </Grid>;
    }

    let selectedItemIds = valueCounts
        .filter((value) => Tools.findFirstByPredicate(prop.selectedFacets, (e) => e.containsValueOrMWTitle(value)) != null)
        .map(v => v.mwTitle ? v.mwTitle.title : v.value.toString());

    let groupConfiguration = wikiContext.config.fs2gPropertyGrouping[prop.property.title];

    return groupConfiguration ? <PropertyValueTree property={prop.property}
                                       valueCounts={valueCounts}
                                       selectedItemIds={selectedItemIds}
                                       onBulkChange={prop.onBulkChange}/>
        :
        <PropertyValueGrid property={prop.property}
                           valueCounts={valueCounts}
                           selectedItemIds={selectedItemIds}
                           onChange={prop.onChange}/>


}

function PropertyValueGrid(prop: {
    property: Property,
    selectedItemIds: string[],
    valueCounts: ValueCount[],
    onChange: (e: SyntheticEvent, checked: boolean, v: ValueCount) => void,
}) {
    let values: any = [];
    let rows: ValueCount[][] = Tools.splitArray2NTuples(prop.valueCounts, 3);

    rows.forEach((row) => {
        values.push(row.map((value) => {
            let selectedValue = DisplayTools.serializeFacetValue(prop.property, value);
            let isSelected = prop.selectedItemIds.includes(selectedValue)
            return <Grid size={4}>
                <FormControlLabel
                    key={selectedValue}
                    control={<Checkbox defaultChecked={isSelected}/>}
                    onChange={(event, checked) => {
                        prop.onChange(event, checked, value);
                    }}
                    label={selectedValue + " (" + value.count + ")"}/>
            </Grid>;
        }));

    });
    return <Grid container spacing={2}>
        {values}
    </Grid>;
}

function PropertyValueTree(prop: {
    property: Property,
    selectedItemIds: string[],
    valueCounts: ValueCount[],
    onBulkChange: (e: SyntheticEvent, v: ValueCount[]) => void
}) {
    let wikiContext = useContext(WikiContext);

    let items;
    let groupConfiguration = wikiContext.config.fs2gPropertyGrouping[prop.property.title];
    if (typeof groupConfiguration === 'string') {
        items = TreeCreator.createGroupItemsBySeparator(prop.valueCounts, prop.property, groupConfiguration);
    } else {
        items = TreeCreator.createGroupItemsBySpecifiedValues(prop.valueCounts, prop.property, groupConfiguration);
    }
    let {groups, groupTreeItems} = items;

    function onSelectedItemsChange(event: React.SyntheticEvent, itemIds: string[]) {
        itemIds = itemIds.map(i => decodeURIComponent(i));

        let selectedValueCounts = prop.valueCounts.filter(v => {
            let id = v.mwTitle ? v.mwTitle.title : v.value.toString();
            return itemIds.includes(id);
        });

        prop.onBulkChange(event, selectedValueCounts);
    }

    return <SimpleTreeView checkboxSelection={true}
                           defaultExpandedItems={Object.keys(groups)}
                           multiSelect={true}
                           defaultSelectedItems={prop.selectedItemIds.map(i => encodeURIComponent(i))}
                           selectionPropagation={{descendants: true, parents: true}}
                           onSelectedItemsChange={onSelectedItemsChange}
    >{groupTreeItems}
    </SimpleTreeView>
};

export default FacetOrDialogContent;