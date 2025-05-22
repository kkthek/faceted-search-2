import {Property, ValueCount} from "../common/datatypes";
import DisplayTools from "../util/display_tools";
import {TreeItem} from "@mui/x-tree-view";
import * as React from "react";
import Tools from "../util/tools";

class GroupItem {
    value: ValueCount
    label: string

    constructor(value: ValueCount, label: string) {
        this.value = value;
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

            let displayValue = DisplayTools.serializeFacetValue(property, v)
            let parts = displayValue.split(separator);
            if (parts.length === 1) {
                groups['ungrouped'] = groups['ungrouped'] ?? new Group('ungrouped');
                groups['ungrouped'].addGroupItem(new GroupItem(v, parts[0].trim()));
            } else if (parts.length > 1) {
                groups[parts[0].trim()] = groups[parts[0].trim()] ??  new Group(parts[0].trim());
                groups[parts[0].trim()].addGroupItem(new GroupItem(v, parts.splice(1).join(separator)));
            }
        });
        for (let groupId in groups) {
            let facetValueTreeItems = groups[groupId].items.map((v: GroupItem) => {
                let displayValue = DisplayTools.serializeFacetValue(property, v.value);
                return <TreeItem key={displayValue} itemId={encodeURIComponent(displayValue)} label={v.label}/>
            });
            if (facetValueTreeItems.length > 0) {
                groupTreeItems.push(<TreeItem key={groupId} itemId={groupId}
                                              label={groupId}>{facetValueTreeItems}</TreeItem>);
            }
        }
        return {groups, groupTreeItems};
    }

    static createGroupItemsBySpecifiedValues(valueCounts: ValueCount[], property: Property, specifiedValues: any) {
        let allFacetValues = valueCounts.map(v => DisplayTools.serializeFacetValue(property, v));
        let groups = Tools.deepClone(specifiedValues);
        for (let groupId in groups) {
            groups[groupId] = Tools.intersect(groups[groupId], allFacetValues);
        }

        let groupTreeItems = [];
        for (let groupId in groups) {
            let facetValueTreeItems = groups[groupId].map((v: any) => <TreeItem key={v} itemId={v} label={v}/>);
            if (facetValueTreeItems.length > 0) {
                groupTreeItems.push(<TreeItem key={groupId} itemId={groupId}
                                              label={groupId}>{facetValueTreeItems}</TreeItem>);
            }
        }
        return {groups, groupTreeItems};
    }
}

export default TreeCreator;
