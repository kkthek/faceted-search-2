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
    onValuesClick: (p: PropertyFacet[], property: Property) => void,
    onChange: (e: SyntheticEvent, checked: boolean, v: ValueCount) => void,
    onBulkChange: (e: SyntheticEvent, v: ValueCount[]) => void
}) {
    let wikiContext = useContext(WikiContext);
    const valueCounts = prop.searchStateFacets?.getPropertyValueCount(prop.property).values;
    if (prop.property.isRangeProperty() || prop.property.isBooleanProperty()) {
        return <Grid container spacing={2}>
            <Typography>Properties of type "datetime", "number" or "boolean" cannot be used with OR</Typography>
        </Grid>;
    }

    let groups = wikiContext.config.fs2gPropertyGrouping[prop.property.title];
    if (groups) {
        let allValues = valueCounts.map(v => v.value ? v.value.toString() : v.mwTitle.title);
        for(let group in groups) {
            groups[group] = Tools.intersect(groups[group], allValues);
        }
        let selectedItemIds = valueCounts
            .filter((value) => Tools.findFirstByPredicate(prop.selectedFacets, (e) => e.containsValueOrMWTitle(value)) != null)
            .map(v => v.value ? v.value.toString() : v.mwTitle.title);
        return createTree(groups, selectedItemIds);
    } else {
        return createGrid();
    }

    function createTree(groupMap: any, selectedItemIds: string[]) {
        let groupElements = [];
        let allGroups: string[]= [];
        for(let group in groupMap) {
            let values = groupMap[group].map((v: any) => <TreeItem key={v} itemId={v} label={v}/>);
            allGroups.push(group);
            if (values.length > 0) {
                groupElements.push(<TreeItem key={group} itemId={group} label={group}>{values}</TreeItem>);
            }
        }

        function onSelectedItemsChange(event: React.SyntheticEvent, itemIds: string[]) {
            prop.onBulkChange(event, valueCounts.filter(v => itemIds.includes(v.value ? v.value.toString() : v.mwTitle.title)));
        }

        return <SimpleTreeView checkboxSelection={true}
                               defaultExpandedItems={allGroups}
                               multiSelect={true}
                               defaultSelectedItems={selectedItemIds}
                               selectionPropagation={{descendants: true, parents: true}}
                               onSelectedItemsChange={onSelectedItemsChange}
        >{groupElements}
        </SimpleTreeView>
    };

    function createGrid() {
        let values: any = [];
        let rows: ValueCount[][] = Tools.splitArray2NTuples(valueCounts, 3);

        rows.forEach((row) => {
            values.push(row.map((value) => {
                let selectedValue = DisplayTools.serializeFacetValue(prop.property, value);
                selectedValue += "(" + value.count + ")";
                let isSelected = Tools.findFirstByPredicate(prop.selectedFacets, (e) => e.containsValueOrMWTitle(value)) != null;
                return <Grid size={4}>
                    <FormControlLabel
                        key={selectedValue}
                        control={<Checkbox defaultChecked={isSelected}/>}
                        onChange={(event, checked) => {
                            prop.onChange(event, checked, value)
                        }}
                        label={selectedValue}/>
                </Grid>;
            }));

        });
        return <Grid container spacing={2}>
            {values}
        </Grid>;
    }


}

export default FacetOrDialogContent;