import {FacetResponse, FacetValue, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import Tools from "../util/tools";
import DisplayTools from "../util/display_tools";
import {Checkbox, FormControlLabel, Grid, Typography} from "@mui/material";
import * as React from "react";
import {SyntheticEvent, useContext, useEffect, useState} from "react";
import {WikiContext} from "../index";
import {SimpleTreeView, TreeItem} from "@mui/x-tree-view";
import TreeCreator, {GroupItem, Groups} from "./facet_or_dialog_tree";
import Client from "../common/client";

function FacetOrDialogContent(prop: {
    client: Client,
    searchStateFacets: FacetResponse,
    selectedValues: FacetValue[],
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
        .filter((value) => Tools.findFirstByPredicate(prop.selectedValues,
            (e) => e.containsValueOrMWTitle(value.value, value.mwTitle)) != null)
        .map(v => v.mwTitle ? v.mwTitle.title : v.value.toString());

    let groupConfiguration = wikiContext.config.fs2gPropertyGrouping[prop.property.title]
                            || wikiContext.config.fs2gPropertyGroupingBySeparator[prop.property.title]
                            || wikiContext.config.fs2gPropertyGroupingByUrl[prop.property.title];

    return groupConfiguration ? <PropertyValueTree property={prop.property}
                                       valueCounts={valueCounts}
                                       selectedItemIds={selectedItemIds}
                                       onBulkChange={prop.onBulkChange}
                                       client={prop.client}
        />
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

    let valueCounts = prop.valueCounts.sort((a,b) => a.compare(b));
    let rows: ValueCount[][] = Tools.splitArray2NTuples(valueCounts, 3);

    rows.forEach((row) => {
        values.push(row.map((value) => {
            let selectedValue = DisplayTools.serializeFacetValue(prop.property, value);
            let selectedId = value.mwTitle ? value.mwTitle.title : value.value.toString();
            let isSelected = prop.selectedItemIds.includes(selectedId)

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
    client: Client,
    property: Property,
    selectedItemIds: string[],
    valueCounts: ValueCount[],
    onBulkChange: (e: SyntheticEvent, v: ValueCount[]) => void
}) {
    let wikiContext = useContext(WikiContext);

    let groupConfiguration = wikiContext.config.fs2gPropertyGrouping[prop.property.title];
    let groupConfigurationBySeparator = wikiContext.config.fs2gPropertyGroupingBySeparator[prop.property.title];
    let groupConfigurationByUrl = wikiContext.config.fs2gPropertyGroupingByUrl[prop.property.title];

    const [content, setContent] = useState<Groups>(null);
    useEffect(() => {
        let groups: Groups;
        if (groupConfigurationByUrl) {
            const path = groupConfigurationByUrl.trim();
            prop.client.getCustomEndpoint(path).then((jsonObject) => {
                groups = TreeCreator.createGroupItemsBySpecifiedValues(prop.valueCounts, prop.property, jsonObject);
                setContent(groups);
            });
        } else if (groupConfigurationBySeparator) {
            groups = TreeCreator.createGroupItemsBySeparator(prop.valueCounts, prop.property, groupConfigurationBySeparator);
            setContent(groups);
        } else if (groupConfiguration) {
            groups = TreeCreator.createGroupItemsBySpecifiedValues(prop.valueCounts, prop.property, groupConfiguration);
            setContent(groups);
        }

    }, [prop.valueCounts]);

    function onSelectedItemsChange(event: React.SyntheticEvent, itemIds: string[]) {
        itemIds = itemIds.map(i => decodeURIComponent(i));

        let selectedValueCounts = prop.valueCounts.filter(v => {
            let id = v.mwTitle ? v.mwTitle.title : v.value.toString();
            return itemIds.includes(id);
        });

        prop.onBulkChange(event, selectedValueCounts);
    }

    return <SimpleTreeView checkboxSelection={true}
                           expandedItems={Object.keys(content ?? []).map(e => "group_"+e)}
                           multiSelect={true}
                           defaultSelectedItems={prop.selectedItemIds.map(i => encodeURIComponent(i))}
                           selectionPropagation={{descendants: true, parents: true}}
                           onSelectedItemsChange={onSelectedItemsChange}
    >{createItemsFromGroups(content)}
    </SimpleTreeView>
};

function createItemsFromGroups(groups: Groups) {
    let groupTreeItems = [];
    const ordered = Tools.orderKeys(groups ?? {});
    for (let groupId in ordered) {

        if (groupId === '__ungrouped__') {
            groups[groupId].items
                .sort((a,b) => a.label.localeCompare(b.label))
                .map((v: GroupItem) => {
                    return <TreeItem key={encodeURIComponent(v.id)}
                                     itemId={encodeURIComponent(v.id)}
                                     label={v.label+ " (" + v.count + ")"}
                    />
                }).forEach(e => groupTreeItems.push(e));
            continue;
        }
        let facetValueTreeItems = groups[groupId].items
            .sort((a,b) => a.label.localeCompare(b.label))
            .map((v: GroupItem) => {
            return <TreeItem key={encodeURIComponent(v.id)}
                             itemId={encodeURIComponent(v.id)}
                             label={v.label+ " (" + v.count + ")"}
            />
        });
        if (facetValueTreeItems.length > 0) {
            groupTreeItems.push(<TreeItem key={"group_"+groupId}
                                          itemId={"group_"+groupId}
                                          label={groups[groupId].label}
            >{facetValueTreeItems}</TreeItem>);
        }
    }
    return groupTreeItems;
}

export default FacetOrDialogContent;