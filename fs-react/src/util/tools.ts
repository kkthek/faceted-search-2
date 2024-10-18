import {BaseQuery, FacetsQuery, Property, PropertyFacet, PropertyResponse, ValueCount} from "../common/datatypes";

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

    static removeFirst<T>(arr: T[], getKey: (e: T) => string, key: string): T {
        let index = -1;
        let found;
        for(let i = 0; i < arr.length;i++) {
            if (getKey(arr[i]) === key) {
                index = i;
                found = arr[i];
                break;
            }
        }

        if (index > -1) {
            arr.splice(index, 1);
            return found;
        }
        return null;
    }

    static removeAll<T>(arr: T[], getKey: (e: T) => string, key: string): void {
        while (this.removeFirst(arr, getKey, key) !== null);
    }

    static isPropertyFacetSelected(query: BaseQuery, property: PropertyResponse): boolean {
        return Tools.findFirst(query.propertyFacets, (e) => e.property, property.title) !== null;
    }

    static isCategoryFacetSelected(query: BaseQuery, category: string): boolean {
        return Tools.findFirst(query.categoryFacets, (e) => e, category) !== null;
    }

    static removePropertyFromFacetQuery(query: FacetsQuery, p: Property): void {
        Tools.removeAll(query.facetQueries, (e) => e.property, p.title);
    }

}

export default Tools;