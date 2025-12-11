
export class WikiContextInterface {
    config: any;
    options: any;
    username: string
    msg: (id: string,  ...params: string[]) => string
    globals: any;

    constructor(config: any = {},
                options: any = {},
                username: string,
                msg: (id: string, ...params: string[]) => string,
                globals: any) {
        this.config = config;
        this.options = options;
        this.username = username;
        this.msg = msg;
        this.globals = globals;
    }

    isObjectConfigured(setting: string): boolean {
        return this.config[setting].length !== 0;
    }

    getFirstInObject(setting: string): string {
        return Object.keys(this.config[setting])[0]
    }

    getLocale(): string {
        return this.config['wgUserLanguage'] ?? (this.config['wgContentLanguage'] ?? 'en');
    }

    getSolrProxyUrl(): string {
        return this.globals.mwRestUrl + "/FacetedSearch2/v1/proxy"
    }

    static fromMWConfig(mw: any): WikiContextInterface {
        const globals: any = {};
        const wgServer = mw.config.get("wgServer");
        const wgScriptPath = mw.config.get("wgScriptPath");
        globals.mwApiUrl = wgServer + wgScriptPath + "/api.php";
        globals.mwRestUrl = wgServer + wgScriptPath + "/rest.php";
        return new WikiContextInterface(
            mw.config.values,
            mw.user.options.values,
            mw.user.getName(),
            mw.msg,
            globals
        );
    }
}

export class WikiContextInterfaceMock extends WikiContextInterface {

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

    static fromDevConfig(config: any, solrProxyUrl: string): WikiContextInterfaceMock {
        return new WikiContextInterfaceMock(config, solrProxyUrl);
    }

    getSolrProxyUrl(): string {
        return this.globals.mwRestUrl;
    }
}