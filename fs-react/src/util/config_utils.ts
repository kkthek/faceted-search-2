import {BaseQuery, Document} from "../common/datatypes";

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

    static containsTrueFacetValue(doc: Document, property: string) {
        let propertyFacetValues = doc.getPropertyFacetValues(property);
        if (propertyFacetValues === null) return false;
        let values = propertyFacetValues.values as boolean[];
        return values.includes(true);
    }

}

export default ConfigUtils;