import {FacetResponse, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import Tools from "../util/tools";
import DisplayTools from "../util/display_tools";
import {Checkbox, FormControlLabel, Grid, Typography} from "@mui/material";
import * as React from "react";
import {SyntheticEvent, useContext} from "react";
import {WikiContext} from "../index";
import {SimpleTreeView, TreeItem} from "@mui/x-tree-view";

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
        .map(v => DisplayTools.serializeFacetValue(prop.property, v));

    let groups = wikiContext.config.fs2gPropertyGrouping[prop.property.title];

    return groups ? <PropertyValueTree property={prop.property}
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
    let allFacetValues = prop.valueCounts.map(v => DisplayTools.serializeFacetValue(prop.property, v));
    let groups = Tools.deepClone(wikiContext.config.fs2gPropertyGrouping[prop.property.title]);
    for (let groupId in groups) {
        groups[groupId] = Tools.intersect(groups[groupId], allFacetValues);
    }
    let groupTreeItems = [];

    for (let groupId in groups) {
        let facetValueTreeItems = groups[groupId].map((v: any) => <TreeItem key={v} itemId={v} label={v}/>);
        if (facetValueTreeItems.length > 0) {
            groupTreeItems.push(<TreeItem key={groupId} itemId={groupId} label={groupId}>{facetValueTreeItems}</TreeItem>);
        }
    }

    function onSelectedItemsChange(event: React.SyntheticEvent, itemIds: string[]) {
        let selectedValueCounts = prop.valueCounts.filter(v => itemIds.includes(DisplayTools.serializeFacetValue(prop.property, v)));
        prop.onBulkChange(event, selectedValueCounts);
    }

    return <SimpleTreeView checkboxSelection={true}
                           defaultExpandedItems={Object.keys(groups)}
                           multiSelect={true}
                           defaultSelectedItems={prop.selectedItemIds}
                           selectionPropagation={{descendants: true, parents: true}}
                           onSelectedItemsChange={onSelectedItemsChange}
    >{groupTreeItems}
    </SimpleTreeView>
};

export default FacetOrDialogContent;