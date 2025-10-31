import {Property, ValueCount} from "../../common/datatypes";
import Tools from "../../util/tools";
import * as React from "react";
import {SyntheticEvent, useContext, useEffect, useState} from "react";
import {WikiContext} from "../../index";
import {SimpleTreeView, TreeItem} from "@mui/x-tree-view";
import TreeCreator, {GroupItem, Groups} from "./tree_generator";
import Client from "../../common/client";

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

    const [content, setContent] = useState<Groups>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>(prop.selectedItemIds.map(i => encodeURIComponent(i)));

    useEffect(() => {
        let groups: Groups;
        if (groupConfigurationByUrl) {
            const path = groupConfigurationByUrl.trim();
            prop.client.getCustomEndpoint(wikiContext.globals.mwRestUrl + path).then((jsonObject) => {
                groups = TreeCreator.createGroupItemsBySpecifiedValues(prop.valueCounts, jsonObject);
                setContent(groups);
            });
        } else if (groupConfigurationBySeparator) {
            groups = TreeCreator.createGroupItemsBySeparator(prop.valueCounts, prop.property, groupConfigurationBySeparator);
            setContent(groups);
        } else if (groupConfiguration) {
            groups = TreeCreator.createGroupItemsBySpecifiedValues(prop.valueCounts, groupConfiguration);
            setContent(groups);
        }

    }, [prop.valueCounts]);

    function onSelectedItemsChange(event: React.SyntheticEvent, itemIds: string[]) {
        itemIds = itemIds.map(i => decodeURIComponent(i));

        const selectedValueCounts = prop.valueCounts.filter(v => {
            let id = v.mwTitle ? v.mwTitle.title : v.value.toString();
            return itemIds.includes(id);
        });
        setSelectedItems(itemIds);
        prop.onBulkChange(event, selectedValueCounts);
    }

    return <SimpleTreeView checkboxSelection={true}
                           expandedItems={Object.keys(content ?? []).map(e => "group_"+e)}
                           multiSelect={true}
                           selectedItems={selectedItems}
                           selectionPropagation={{descendants: true, parents: true}}
                           onSelectedItemsChange={onSelectedItemsChange}
    >{createItemsFromGroups(content)}
    </SimpleTreeView>
};

function createItemsFromGroups(groups: Groups) {
    const groupTreeItems = [];
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

export default PropertyValueTree;