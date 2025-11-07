import {CustomDeserializerParams} from "typedjson/lib/types/metadata";
import {MWTitleWithURL, Property, ValueCount} from "../common/datatypes";
import {ReactElement} from "react";

class Tools {

    static deserializeValue(value: any) {
        if (value == null) {
            return null;
        }
        if (value.title) {
            return new MWTitleWithURL(value.title, value.displayTitle, value.url);
        } else if (typeof(value) === 'string' && value.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/)) {
            return new Date(Date.parse(value))
        } else return value;
    }

    static arrayDeserializer(
        json: Array<{prop: string; shouldDeserialize: boolean}>,
        params: CustomDeserializerParams,
    ) {
        if (!json.map) {
            return [];
        }
        return json.map(
            value => Tools.deserializeValue(value)
        );
    }

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

    static createId(rawId: string) {
        return rawId.replace(/[\W]/g, '')
    }

    static createItemIdForProperty(property: Property) {
        const rawId = property.title + "_" + property.type
        return rawId.replace(/[\W]/g, '');
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

    static secureUUIDV4() {
        return (""+1e7+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c: any) =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

}


export default Tools;