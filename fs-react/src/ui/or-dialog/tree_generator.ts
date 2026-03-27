import ObjectTools from "../../util/object_tools";
import {Property} from "../../common/property";
import {ValueCount} from "../../common/response/value_count";
import ConfigUtils from "../../util/config_utils";
import {WikiContextAccessor} from "../../common/wiki_context";

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

    static createGroupItemsBySeparator(valueCounts: ValueCount[], property: Property, separator: string, wikiContext: WikiContextAccessor): Groups {

        const groups: Groups = {};
        valueCounts.forEach((v) => {

            const valueLabel = v.getDisplayText(ConfigUtils.context(wikiContext));
            const valueId = v.itemId();
            const parts = valueId.split(separator);
            if (parts.length === 1) {
                groups['__ungrouped__'] = groups['__ungrouped__'] ?? new Group('-');
                const itemLabel = valueLabel !== valueId ? valueLabel : parts[0].trim();
                groups['__ungrouped__'].addGroupItem(new GroupItem(valueId, itemLabel, v.count));
            } else if (parts.length > 1) {
                const groupName = parts[0].trim();
                groups[groupName] = groups[groupName] ??  new Group(groupName);
                const itemLabel = valueLabel !== valueId ? valueLabel : parts.splice(1).join(separator);
                groups[groupName].addGroupItem(new GroupItem(valueId, itemLabel, v.count));
            }
        });

        return groups;
    }

    static createGroupItemsBySpecifiedValues(valueCounts: ValueCount[], specifiedValues: any): Groups {

        const groups: Groups = {};
        const groupsCopy = ObjectTools.deepClone(specifiedValues);
        for (let groupId in groupsCopy) {
            const groupItems = valueCounts.intersect(
                (v) => v.itemId(),
                groupsCopy[groupId]
            );
            groups[groupId] = new Group(groupId);
            groupItems.map((v) => {
                const value =  v.itemId()
                return new GroupItem(value, value, v.count)
            })
            .forEach(item => groups[groupId].addGroupItem(item));
        }

        return groups;
    }
}

export default TreeCreator;
