import {BaseQuery, CategoryFacetCount, Datatype, Order, Property, PropertyFacetCount, Sort} from "../common/datatypes";

class ConfigUtils {

    static getShownFacets(fs2gShownFacets: any, query: BaseQuery): string[] {

        let results: string[] = [];
        query.categoryFacets.forEach((category) => {
            let propertiesOfCategory = fs2gShownFacets[category] || [];
            results = [...results, ...propertiesOfCategory];
        });
        // @ts-ignore
        return [...new Set(results)]
    }

    static getSortFunctionForPropertyFacets(sortType: string) {
        switch(sortType) {
            case 'sort-by-count':
                return (a: PropertyFacetCount, b: PropertyFacetCount) => b.count - a.count;
            default:
            case 'sort-alphabetically':
                return (a: PropertyFacetCount, b: PropertyFacetCount) =>
                     a.property.title.toLowerCase().localeCompare(b.property.title.toLowerCase())
        }
    }

    static getSortFunctionForCategoryFacets(sortType: string) {
        switch(sortType) {
            case 'sort-by-count':
                return (a: CategoryFacetCount, b: CategoryFacetCount) => b.count - a.count;
            default:
            case 'sort-alphabetically':
                return (a: CategoryFacetCount, b: CategoryFacetCount) =>
                    a.category.toLowerCase().localeCompare(b.category.toLowerCase())
        }
    }

    static getFileExtension(url: string) {
        let u = (URL as any).parse(url);
        if (u === null) return '';
        return u['pathname'].toLowerCase().split('.').pop();
    }

    static getFileType(ext: string) {
        switch (ext) {
            case 'pdf': return "application/pdf";
            case 'png': return "image/png";
            case 'jpeg':
            case 'jpg': return "image/jpeg";
            default:
                return 'application/text';
        }
    }

    static getSortByName(name: string): Sort {
        switch(name) {
            case 'newest': return new Sort(new Property('_MDAT', Datatype.datetime), Order.desc);
            case 'oldest': return new Sort(new Property('_MDAT', Datatype.datetime), Order.asc);
            case 'ascending': return new Sort(new Property('displaytitle', Datatype.internal), Order.asc);
            case 'descending': return new Sort(new Property('displaytitle', Datatype.internal), Order.desc);
            default:
            case 'score': return new Sort(new Property('score', Datatype.internal), Order.desc);
        }
    }

    static calculatePermutation(order: string[], defaultOrder: string[]) {
        return order.map((e) => defaultOrder.indexOf(e));
    }

}

export default ConfigUtils;