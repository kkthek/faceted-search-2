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

    static removeFirst<T>(arr: T[], getKey: (e: T) => string, key: string): void {
        let index = -1;
        for(let i = 0; i < arr.length;i++) {
            if (getKey(arr[i]) === key) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            arr.splice(index, 1);
        }
    }

    static isPropertyFacetSelected(query: BaseQuery, property: PropertyResponse): boolean {
        return Tools.findFirst(query.propertyFacets, (e) => e.property, property.title) !== null;
    }

    static isCategoryFacetSelected(query: BaseQuery, category: string): boolean {
        return Tools.findFirst(query.categoryFacets, (e) => e, category) !== null;
    }

    static removePropertyFacet(query: BaseQuery, facet: PropertyFacet): void {
        if (!facet.value && !facet.mwTitle && !facet.range) {
            Tools.removeFirst(query.propertyFacets, (e) => e.property, facet.property);
        } else {
            Tools.removeFirst(query.propertyFacets, (e) => this.serializeFacetValue(e), this.serializeFacetValue(facet));
        }
    }

    static removePropertyFromFacetQuery(query: FacetsQuery, p: Property): void {
        Tools.removeFirst(query.facetQueries, (e) => e.property, p.title);
    }

    private static serializeFacetValue(p: PropertyFacet) {
        let property = p.property;
        if (p.value !== null) {
            return property+p.value;
        } else if (p.mwTitle instanceof Object) {
            return property+p.mwTitle.title+":"+p.mwTitle.displayTitle;
        } else if (p.range instanceof Object) {
            // range
            return property+p.range.from + "-" + p.range.to;
        }
        return '';
    }

}

export default Tools;