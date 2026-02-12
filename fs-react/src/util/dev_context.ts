import Client from "../common/client";
import {WikiContextAccessor} from "../common/wiki_context";

export async function initializeDevContext()
{
    const url = "http://localhost:9000";
    const client = new Client(url);
    const config = await client.getSettingsForDevContext();
    const wikiContext = WikiContextAccessorMock.fromDevConfig(config, url);
    return { client: client, wikiContext: wikiContext};
}

class WikiContextAccessorMock extends WikiContextAccessor {

    private readonly langMap: any;

    constructor(result: any = {}, solrProxUrl: string) {
        const globals: any = {};
        globals.mwRestUrl = solrProxUrl;
        globals.mwApiUrl = solrProxUrl + '/api.php';
        super(result.settings, result.options, "dummy user", null, globals);
        this.langMap = result.lang;
        this.msg = this.msgFunction;
    }

    msgFunction(id: string, ...params: string[]) {
        let text = this.langMap[id] ? this.langMap[id] : "<" + id + ">";
        for(let i = 0; i < params.length; i++) {
            text = text.replace(new RegExp('\\$'+(i+1)), params[i]);
        }
        return text;
    };

    static fromDevConfig(config: any, solrProxyUrl: string): WikiContextAccessorMock {
        return new WikiContextAccessorMock(config, solrProxyUrl);
    }

    getSolrProxyUrl(): string {
        return this.globals.mwRestUrl;
    }
}