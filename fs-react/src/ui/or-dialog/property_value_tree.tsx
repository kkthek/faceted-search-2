import * as React from "react";
import {SyntheticEvent, useContext, useEffect, useState} from "react";
import {WikiContext} from "../../index";
import {SimpleTreeView, TreeItem} from "@mui/x-tree-view";
import TreeCreator, {GroupItem, Groups} from "./tree_generator";
import Client from "../../common/client";
import ObjectTools from "../../util/object_tools";
import {Property} from "../../common/property";
import {ValueCount} from "../../common/response/value_count";

function PropertyValueTree(prop: {
    client: Client,
    property: Property,
    selectedItemIds: string[],
    valueCounts: ValueCount[],
    onBulkChange: (e: SyntheticEvent, v: ValueCount[]) => void
}) {
    const wikiContext = useContext(WikiContext);

    const groupConfiguration = wikiContext.config.fs2gPropertyGrouping[prop.property.title];
    const groupConfigurationBySeparator = wikiContext.config.fs2gPropertyGroupingBySeparator[prop.property.title];
    const groupConfigurationByUrl = wikiContext.config.fs2gPropertyGroupingByUrl[prop.property.title];

    let groups: Groups;
    if (groupConfigurationBySeparator) {
        groups = TreeCreator.createGroupItemsBySeparator(prop.valueCounts, groupConfigurationBySeparator, wikiContext);
    } else if (groupConfiguration) {
        groups = TreeCreator.createGroupItemsBySpecifiedValues(prop.valueCounts, groupConfiguration);
    }
    const [content, setContent] = useState<Groups>(groups);
    const [selectedItems, setSelectedItems] = useState<string[]>(prop.selectedItemIds.map(i => encodeURIComponent(i)));

    useEffect(() => {
        if (!groupConfigurationByUrl) {
            return;
        }
        const path = groupConfigurationByUrl.trim();
        prop.client.getCustomEndpoint(wikiContext.globals.mwRestUrl + path).then((jsonObject) => {
            const groups = TreeCreator.createGroupItemsBySpecifiedValues(prop.valueCounts, jsonObject);
            setContent(groups);
        });

    }, [prop.valueCounts]);

    function onSelectedItemsChange(event: React.SyntheticEvent, itemIds: string[]) {
        itemIds = itemIds.map(i => decodeURIComponent(i));

        const selectedValueCounts = prop.valueCounts.filter(v => {
            let id = v.itemId();
            return itemIds.includes(id);
        });
        setSelectedItems(itemIds);
        prop.onBulkChange(event, selectedValueCounts);
    }

    const groupIds = Object.keys(content ?? []);
    return <SimpleTreeView checkboxSelection={true}
                           expandedItems={groupIds.map(groupIdPrefix)}
                           multiSelect={true}
                           selectedItems={selectedItems}
                           selectionPropagation={{descendants: true, parents: true}}
                           onSelectedItemsChange={onSelectedItemsChange}
    >{createItemsFromGroups(content)}
    </SimpleTreeView>
}

function groupIdPrefix(groupId: string) {
    return "group_" + groupId;
}

function createItemsFromGroups(groups: Groups) {
    const groupTreeItems = [];
    const orderedGroupIds = ObjectTools.orderKeys(groups ?? {});
    for (let groupId in orderedGroupIds) {

        if (groupId === '__ungrouped__') {
            groups[groupId].items
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((v: GroupItem) => {
                    return <TreeItem key={encodeURIComponent(v.id)}
                                     itemId={encodeURIComponent(v.id)}
                                     label={v.label + " (" + v.count + ")"}
                    />
                }).forEach(e => groupTreeItems.push(e));
            continue;
        }
        const facetValueTreeItems = groups[groupId].items
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((v: GroupItem) => {
                return <TreeItem key={encodeURIComponent(v.id)}
                                 itemId={encodeURIComponent(v.id)}
                                 label={v.label + " (" + v.count + ")"}
                />
            });
        if (facetValueTreeItems.length === 0) {
            return;
        }
        groupTreeItems.push(<TreeItem key={groupIdPrefix(groupId)}
                                      itemId={groupIdPrefix(groupId)}
                                      label={groups[groupId].label}
        >{facetValueTreeItems}</TreeItem>);
    }
    return groupTreeItems;
}

export default PropertyValueTree;