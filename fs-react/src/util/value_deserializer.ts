import {CustomDeserializerParams} from "typedjson/lib/types/metadata";
import {MWTitleWithURL} from "../common/response/mw_title_with_URL";

class ValueDeserializer {
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
        json: Array<{prop: string; shouldDeserialize: boolean}>
    ) {
        if (!json.map) {
            return [];
        }
        return json.map(
            value => ValueDeserializer.deserializeValue(value)
        );
    }

}

export default ValueDeserializer;