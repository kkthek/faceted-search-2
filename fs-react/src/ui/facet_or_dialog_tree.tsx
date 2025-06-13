import {Property, ValueCount} from "../common/datatypes";
import DisplayTools from "../util/display_tools";
import * as React from "react";
import Tools from "../util/tools";

export class GroupItem {
    id: string
    label: string
    count: number

    constructor(value: string, label: string, count: number) {
        this.id = value;
        this.label = label;
        this.count = count;
    }
}

export class Group {
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

export interface Groups {
    [key: string]: Group;
}

class TreeCreator {

    static createGroupItemsBySeparator(valueCounts: ValueCount[], property: Property,  separator: string): Groups {

        let groups: Groups = {};
        valueCounts.forEach((v) => {

            let valueLabel = DisplayTools.serializeFacetValue(property, v);
            let valueId = v.mwTitle ? v.mwTitle.title : v.value.toString();
            let parts = valueId.split(separator);
            if (parts.length === 1) {
                groups['__ungrouped__'] = groups['__ungrouped__'] ?? new Group('-');
                let itemLabel = valueLabel !== valueId ? valueLabel : parts[0].trim();
                groups['__ungrouped__'].addGroupItem(new GroupItem(valueId, itemLabel, v.count));
            } else if (parts.length > 1) {
                let groupName = parts[0].trim();
                groups[groupName] = groups[groupName] ??  new Group(groupName);
                let itemLabel = valueLabel !== valueId ? valueLabel : parts.splice(1).join(separator);
                groups[groupName].addGroupItem(new GroupItem(valueId, itemLabel, v.count));
            }
        });

        return groups;
    }

    static createGroupItemsBySpecifiedValues(valueCounts: ValueCount[], property: Property, specifiedValues: any): Groups {

        let groups: Groups = {};
        let groupsCopy = Tools.deepClone(specifiedValues);
        for (let groupId in groupsCopy) {
            let groupItems = Tools.intersect(valueCounts, groupsCopy[groupId]);
            groups[groupId] = new Group(groupId);
            groupItems.map((v) => {
                const value =  v.mwTitle ? v.mwTitle.title : v.value.toString()
                return new GroupItem(value, value, v.count)
            })
            .forEach(item => groups[groupId].addGroupItem(item));
        }

        return groups;
    }
}

export default TreeCreator;
