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

    static range(limit: number) {
        return Array(limit).fill(0).map((x,i)=>i);
    }

    static splitArray2NTuples<T>(arr: T[], size: number): T[][] {
        let results: T[][] = [];
        let length = Math.trunc(arr.length / size);
        length += arr.length % size === 0 ? 0 : 1;
        for(let i = 0; i < length; i++) {
            let row: T[] = [];
            for(let j = 0; j < size; j++) {
                if (arr[i*size+j]) {
                    row.push(arr[i*size+j]);
                }
            }
            results.push(row);
        }
        return results;
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

    static reorder(items: ReactElement[], order: number[]) {
        let results: ReactElement[] = [];
        for(let i = 0; i < items.length; i++) {
            results[i] = order[i] !== undefined ? items[order[i]] : undefined;
        }
        return results;
    }

    static intersect(array1: ValueCount[], array2: string[]) {
        return array1.filter(v => {
            const value = v.mwTitle ? v.mwTitle.title : v.value.toString();
            return array2.includes(value);
        });
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