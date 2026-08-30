import {DocumentQuery} from "../common/request/document_query";
import {WikiContextAccessor} from "../common/wiki_context";
import ConfigUtils from "./config_utils";
import {Range} from "../common/range";
import {Order} from "../common/datatypes";

export function generateAskQuery(query: DocumentQuery, wikiContext: WikiContextAccessor): string {
    let q: string[];

    // Categories
    q = query.categoryFacets.map((category) => `[[Category:${category}]]`);

    // Namespaces
    const namespaceConditions = query.namespaceFacets.map((namespaceId) => {
        const namespaceAsText = ConfigUtils.getNamespaceAsText(wikiContext, namespaceId);
        return `[[${namespaceAsText}:+]]`;
    });
    q = [...q, ...namespaceConditions];

    // Properties
    query.propertyFacets.forEach((p) => {
        const propertyTitle = p.property.title;
        let cond;
        if (p.values.length === 0) return;
        if (p.values.length === 1) {
            const v = p.values[0];
            if (v.isEmpty()) {
                cond = `[[${propertyTitle}::+]]`;
            } else if (p.property.isRangeProperty()) {
                const range = v.range as Range;
                cond = `[[${propertyTitle}::>=${range.fromToString()}]] [[${propertyTitle}::<=${range.toToString()}]]`;
            } else {
                cond = `[[${propertyTitle}::${v.toString()}]]`;
            }
        } else {
            cond = `[[${propertyTitle}::${p.values.join(' || ')}]]`;
        }
        q.push(cond);
    });

    return q.join("\n");
}

export function getAskParams(query: DocumentQuery, wikiContext: WikiContextAccessor) {
    const result: any = {};
    const sortKey = query.sorts[0].getKey();
    if ('score' !== sortKey && 'ascending' !== sortKey && 'descending' !== sortKey) {
        // score and descending are not supported, ascending is default
        const sort = ConfigUtils.getSortByKeyOrDefault(sortKey);
        const fs2SMWLanguage = wikiContext.config['fs2gSMWLanguage'] ?? {};
        result["sort"] = fs2SMWLanguage[sort.property.title] ?? sort.property.title;
        result["order"] = sort.order === Order.asc ? 'asc' : 'desc';
    }
    return result;
}
