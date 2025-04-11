import {BaseQuery} from "../common/datatypes";

class ConfigUtils {

    static getShownFacets(fsg2ShownFacets: any, query: BaseQuery): string[] {

        let results: string[] = [];
        query.categoryFacets.forEach((category) => {
            let propertiesOfCategory = fsg2ShownFacets[category] || [];
            results = [...results, ...propertiesOfCategory];
        });
        // @ts-ignore
        return [...new Set(results)]
    }
}

export default ConfigUtils;