
export class WikiContextInterface {
    config: any;
    options: any;
    username: string
    msg: (id: string,  ...params: string[]) => string

    constructor(config: any = {},
                options: any = {},
                username: string,
                msg: (id: string, ...params: string[]) => string) {
        this.config = config;
        this.options = options;
        this.username = username;
        this.msg = msg;
    }

    isObjectConfigured(setting: string): boolean {
        return this.config[setting].length !== 0;
    }

    getFirstInObject(setting: string): string {
        return Object.keys(this.config[setting])[0]
    }
}

export class WikiContextInterfaceMock extends WikiContextInterface {

    private readonly langMap: any;

    constructor(result: any = {}) {
        let msgFunction = (id: string, ...params: string[]) => {
            let text = this.langMap[id] ? this.langMap[id] : "<" + id + ">";
            for(let i = 0; i < params.length; i++) {
                text = text.replace(new RegExp('\\$'+(i+1)), params[i]);
            }
            return text;
        };
        super(result.settings, result.options, "dummy user", msgFunction);
        this.langMap = result.lang;
    }
}