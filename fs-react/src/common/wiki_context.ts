
export class WikiContextAccessor {
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

    static fromMWConfig(mw: any): WikiContextAccessor {
        const globals: any = {};
        const wgServer = mw.config.get("wgServer");
        const wgScriptPath = mw.config.get("wgScriptPath");
        globals.mwApiUrl = wgServer + wgScriptPath + "/api.php";
        globals.mwRestUrl = wgServer + wgScriptPath + "/rest.php";
        return new WikiContextAccessor(
            mw.config.values,
            mw.user.options.values,
            mw.user.getName(),
            mw.msg,
            globals
        );
    }
}

