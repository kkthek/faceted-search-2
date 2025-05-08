import {BaseQuery, Document, WikiContextInterface} from "../common/datatypes";
import Client from "../common/client";

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

    static async getSettingsForDevContext(client: Client, wikiContext: WikiContextInterface) {
        let result = await client.getSettingsForDevContext();
        let langMap = result.lang;
        wikiContext.config = result.settings;
        wikiContext.msg = (id: string, ...params: string[]) => {
            let text = langMap[id] ? langMap[id] : "<" + id + ">";
            for(let i = 0; i < params.length; i++) {
                text = text.replace(new RegExp('\\$'+(i+1)), params[i]);
            }
            return text;
        }

    }


}

export default ConfigUtils;