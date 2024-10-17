import {BaseQuery, PropertyResponse} from "../common/datatypes";

class Tools {

    static createUniqueArray<T>(arr: T[], getKey: (e: T) => string): T[] {
        let mapObj = new Map()
        let result: T[]  = [];
        arr.forEach(v => {
            let prevValue = mapObj.get(getKey(v))
            if(!prevValue){
                mapObj.set(getKey(v), v);
                result.push(v);
            }
        })
        return result;
    }

    static findFirst<T>(arr: T[], getKey: (e: T) => string, key: string): T {
        for(let i = 0; i < arr.length;i++) {
            if (getKey(arr[i]) === key) {
                return arr[i];
            }
        }
        return null;
    }

    static isPropertyFacetSelected(query: BaseQuery, property: PropertyResponse): boolean {
        return Tools.findFirst(query.propertyFacets, (e) => e.property, property.title) !== null;
    }

    static isCategoryFacetSelected(query: BaseQuery, category: string): boolean {
        return Tools.findFirst(query.categoryFacets, (e) => e, category) !== null;
    }

}

export default Tools;