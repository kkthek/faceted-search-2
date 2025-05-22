import {CustomDeserializerParams} from "typedjson/lib/types/metadata";
import {MWTitleWithURL, Property} from "../common/datatypes";
import {ReactElement} from "react";

class Tools {

    static createUniqueArray<T>(arr: T[], getKey: (e: T) => string): T[] {
        let mapObj = new Map()
        let result: T[]  = [];
        arr.forEach(v => {
            let prevValue = mapObj.get(getKey(v))
            if(!prevValue){
                mapObj.set(getKey(v), v);
                result.push(v);
            }
        })
        return result;
    }

    static findFirst<T>(arr: T[], getKey: (e: T) => string, key: string): T {
        for(let i = 0; i < arr.length;i++) {
            if (getKey(arr[i]) === key) {
                return arr[i];
            }
        }
        return null;
    }

    static removeFirst<T>(arr: T[], getKey: (e: T) => string, key: string): T {
        let index = -1;
        let found;
        for(let i = 0; i < arr.length;i++) {
            if (getKey(arr[i]) === key) {
                index = i;
                found = arr[i];
                break;
            }
        }

        if (index > -1) {
            arr.splice(index, 1);
            return found;
        }
        return null;
    }

    static findFirstByPredicate<T>(arr: T[], predicate: (e: T) => boolean): T {
        for(let i = 0; i < arr.length;i++) {
            if (predicate(arr[i])) {
                return arr[i];
            }
        }
        return null;
    }

    static removeFirstByPredicate<T>(arr: T[], predicate: (e: T) => boolean): T {
        let index = -1;
        let found;
        for(let i = 0; i < arr.length;i++) {
            if (predicate(arr[i])) {
                index = i;
                found = arr[i];
                break;
            }
        }

        if (index > -1) {
            arr.splice(index, 1);
            return found;
        }
        return null;
    }

    static replaceFirst<T>(arr: T[], getKey: (e: T) => string, key: string, replacement: T): T {
        let index = -1;
        let found;
        for(let i = 0; i < arr.length;i++) {
            if (getKey(arr[i]) === key) {
                index = i;
                found = arr[i];
                break;
            }
        }

        if (index > -1) {
            arr.splice(index, 1, replacement);
            return found;
        }
        return null;
    }

    static removeAll<T>(arr: T[], getKey: (e: T) => string, key: string): void {
        while (this.removeFirst(arr, getKey, key) !== null);
    }

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
            results[i] = items[order[i]];
        }
        return results;
    }

    static intersect(array1: string[], array2: string[]) {
        return array1.filter(value => array2.includes(value));
    }

    static createId(rawId: string) {
        return rawId.replace(/[\W]/g, '')
    }

    static createItemIdForProperty(property: Property) {
        const rawId = property.title + "_" + property.type
        return rawId.replace(/[\W]/g, '');
    }

}


export default Tools;