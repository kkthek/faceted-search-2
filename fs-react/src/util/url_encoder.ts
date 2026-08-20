type ParamValue = string | number | null | undefined;
type Params = Record<string, ParamValue> | Array<[string | number, ParamValue]> | ParamValue[];

/**
 * Encode an array/object of parameters to a parameter string that can be used for linking.
 *
 * If `forTitle` is true (default), then the parameters are encoded for use in a MediaWiki
 * page title (useful for making internal links to parameterised special pages), otherwise
 * the parameters are encoded HTTP GET style. The parameter name "x" is used to collect
 * parameters that do not have any string keys in GET, and hence "x" should never be used
 * as a parameter name.
 */
export function encodeParameters(params: Params, forTitle: boolean = true): string {
    // Normalize input into an array of [key, value] entries, preserving
    // the distinction between string keys and numeric (unlabelled) keys.
    const entries: Array<[string | number, ParamValue]> = normalizeEntries(params);

    let result = '';

    if (forTitle) {
        // Search/replace pairs (order matters — mirrors PHP str_replace with parallel arrays).
        const search: string[] = [
            '-', '#', '\n', ' ', '/', '[', ']', '<', '>',
            '&lt;', '&gt;', '&amp;', "''", '|', '&', '%', '?', '$', '\\', ';', '_',
        ];
        const replace: string[] = [
            '-2D', '-23', '-0A', '-20', '-2F', '-5B', '-5D', '-3C', '-3E',
            '-3C', '-3E', '-26', '-27-27', '-7C', '-26', '-25', '-3F', '-24', '-5C', '-3B', '-5F',
        ];

        for (const [name, rawValue] of entries) {
            let value = rawValue == null ? '' : String(rawValue);

            if (typeof name === 'string' && name !== '') {
                value = `${name}=${value}`;
            }

            // Escape certain problematic values using SMW-escape
            // (like URL-encode but "-" instead of "%" to prevent double encoding
            //  by later MediaWiki actions).
            value = smwEscape(value, search, replace);

            if (result !== '') {
                result += '/';
            }
            result += value;
        }
    } else {
        // Note: this requires HTTP-compatible parameter names (ASCII).
        const unlabelled: ParamValue[] = [];

        for (const [name, rawValue] of entries) {
            const value = rawValue == null ? '' : String(rawValue);

            if (typeof name === 'string' && name !== '') {
                const encoded = `${rawurlencode(name)}=${rawurlencode(value)}`;
                if (result !== '') {
                    result += '&';
                }
                result += encoded;
            } else {
                unlabelled.push(rawValue);
            }
        }

        if (unlabelled.length > 0) {
            if (result !== '') {
                result = '&' + result;
            }
            result = 'x=' + rawurlencode(encodeParameters(unlabelled, true)) + result;
        }
    }

    return result;
}

/**
 * Normalizes different input shapes into a list of [key, value] entries,
 * preserving whether the key is numeric (unlabelled) or a string.
 */
function normalizeEntries(params: Params): Array<[string | number, ParamValue]> {
    if (Array.isArray(params)) {
        // Could be an array of tuples or a plain array of values.
        if (params.length > 0 && Array.isArray(params[0]) && (params[0] as unknown[]).length === 2) {
            return params as Array<[string | number, ParamValue]>;
        }
        return (params as ParamValue[]).map((v, i) => [i, v] as [number, ParamValue]);
    }
    // Plain object — all keys become strings in JS, which matches PHP's behavior
    // for arrays with only string keys.
    return Object.entries(params).map(([k, v]) => [k, v] as [string, ParamValue]);
}

/**
 * Performs sequential string replacement, matching PHP's str_replace with
 * parallel search/replace arrays (each replacement is applied in order,
 * and can affect subsequent matches — same as the PHP function).
 */
function smwEscape(value: string, search: string[], replace: string[]): string {
    let out = value;
    for (let i = 0; i < search.length; i++) {
        out = out.split(search[i]).join(replace[i]);
    }
    return out;
}

/**
 * Equivalent of PHP's rawurlencode (RFC 3986).
 * Note: encodeURIComponent doesn't encode !*'() — rawurlencode does.
 */
function rawurlencode(value: string): string {
    return encodeURIComponent(value).replace(
        /[!*'()]/g,
        (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase(),
    );
}