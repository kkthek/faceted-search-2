import {CustomDeserializerParams} from "typedjson/lib/types/metadata";
import {MWTitleWithURL} from "../common/datatypes";

class Tools {

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
            value => this.deserializeValue(value)
        );
    }

}

export default Tools;