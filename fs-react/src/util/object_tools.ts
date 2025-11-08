class ObjectTools {
    static deepClone<T>(obj: T): T {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        const res: any = Array
            .isArray(obj) ? [] : {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                res[key] = this.deepClone(obj[key]);
            }
        }
        return Object.assign(res, obj) as T;
    }

    static orderKeys(o: any) {
        return Object.keys(o).sort().reduce(
            (obj: any, key: string) => {
                obj[key] = o[key];
                return obj;
            },
            {}
        );
    }
}

export default ObjectTools;