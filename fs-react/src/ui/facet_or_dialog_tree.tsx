import {Datatype, Property, ValueCount} from "../common/datatypes";
import DisplayTools from "../util/display_tools";
import {TreeItem} from "@mui/x-tree-view";
import * as React from "react";
import Tools from "../util/tools";

class GroupItem {
    id: string
    label: string

    constructor(value: string, label: string) {
        this.id = value;
        this.label = label;
    }
}

class Group {
    label: string
    items: GroupItem[]

    constructor(label: string) {
        this.label = label;
        this.items = [];
    }

    public addGroupItem(item: GroupItem) {
        this.items.push(item);
    }
}

interface Groups {
    [key: string]: Group;
}

class TreeCreator {

    static createGroupItemsBySeparator(valueCounts: ValueCount[], property: Property,  separator: string) {
        let groups: Groups = {};
        let groupTreeItems: any = [];

        valueCounts.forEach((v) => {

            let valueLabel = DisplayTools.serializeFacetValue(property, v);
            let valueId = v.mwTitle ? v.mwTitle.title : v.value.toString();
            let parts = valueId.split(separator);
            if (parts.length === 1) {
                groups['ungrouped'] = groups['ungrouped'] ?? new Group('-');
                let itemLabel = valueLabel !== valueId ? valueLabel : parts[0].trim();
                groups['ungrouped'].addGroupItem(new GroupItem(valueId, itemLabel));
            } else if (parts.length > 1) {
                let groupName = parts[0].trim();
                groups[groupName] = groups[groupName] ??  new Group(groupName);
                let itemLabel = valueLabel !== valueId ? valueLabel : parts.splice(1).join(separator);
                groups[groupName].addGroupItem(new GroupItem(valueId, itemLabel));
            }
        });
        for (let groupId in groups) {
            let facetValueTreeItems = groups[groupId].items.map((v: GroupItem) => {
                return <TreeItem key={encodeURIComponent(v.id)}
                                 itemId={encodeURIComponent(v.id)}
                                 label={v.label}
                />
            });
            if (facetValueTreeItems.length > 0) {
                groupTreeItems.push(<TreeItem key={groupId}
                                              itemId={groupId}
                                              label={groups[groupId].label}
                >{facetValueTreeItems}</TreeItem>);
            }
        }
        return {groups, groupTreeItems};
    }

    static createGroupItemsBySpecifiedValues(valueCounts: ValueCount[], property: Property, specifiedValues: any) {
        let allFacetValues = valueCounts.map(v => v.mwTitle ? v.mwTitle.title : v.value.toString());
        let groups = Tools.deepClone(specifiedValues);
        for (let groupId in groups) {
            groups[groupId] = Tools.intersect(groups[groupId], allFacetValues);
        }

        let groupTreeItems = [];
        for (let groupId in groups) {
            let facetValueTreeItems = groups[groupId].map((v: any) =>
                <TreeItem key={encodeURIComponent(v)}
                          itemId={encodeURIComponent(v)}
                          label={v}
                />);
            if (facetValueTreeItems.length > 0) {
                groupTreeItems.push(<TreeItem key={groupId} itemId={groupId}
                                              label={groupId}>{facetValueTreeItems}</TreeItem>);
            }
        }
        return {groups, groupTreeItems};
    }
}

export default TreeCreator;
