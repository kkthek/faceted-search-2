
export class WikiContextInterface {
    config: any;
    msg: (id: string,  ...params: string[]) => string

    constructor(config: any = [],
                msg: (id: string, ...params: string[]) => string) {
        this.config = config;
        this.msg = msg;
    }
}

export class WikiContextInterfaceMock extends WikiContextInterface {

    private readonly langMap: any;

    constructor(config: any = {},
                langMap: any = {}) {
        let msgFunction = (id: string, ...params: string[]) => {
            let text = this.langMap[id] ? this.langMap[id] : "<" + id + ">";
            for(let i = 0; i < params.length; i++) {
                text = text.replace(new RegExp('\\$'+(i+1)), params[i]);
            }
            return text;
        };
        super(config, msgFunction);
        this.langMap = langMap;
    }
}