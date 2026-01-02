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
        } else if (this.isNumeric(value)) {
            return parseFloat(value);
        } else if (value === 'true' || value === 'false') {
            return Boolean(value === 'true');
        } else return value;
    }

    private static isNumeric(str: any) {
        return !isNaN(Number(str)) && !isNaN(parseFloat(str));
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