import {DocumentQuery} from "app/common/request/document_query";
import {WikiContextAccessor} from "app/common/wiki_context";
import ConfigUtils from "app/util/config_utils";
import {Order} from "app/common/datatypes";
import {Range} from "app/common/range";

export function generateAskQuery(query: DocumentQuery, wikiContext: WikiContextAccessor): string {
    let q: string[];

    // Categories
    q = query.categoryFacets.map((category) => `[[Category:${category}]]`);

    // Namespaces
    const namespaceConditions = query.namespaceFacets.map((namespaceId) => {
        const namespaceAsText = ConfigUtils.getNamespaceAsText(wikiContext, namespaceId);
        return `${namespaceAsText}:+`;
    });
    if (namespaceConditions.length > 0) {
        q.push("[[" + namespaceConditions.join(' || ') + "]]");
    }

    // Properties
    query.propertyFacets.forEach((p) => {
        const propertyTitle = p.property.title;
        let cond;
        if (p.values.length === 0) return;
        if (p.values.length === 1 && p.values[0].isEmpty()) {
            cond = `[[${propertyTitle}::+]]`;
        } else if (p.property.isRangeProperty()) {
            // this is not OR because range properties cannot be ORed.
            // It's a drilldown, so consider only last value
            const range = p.values[p.values.length - 1].range as Range;
            cond = `[[${propertyTitle}::>=${range.fromToString()}]] [[${propertyTitle}::<=${range.toToString()}]]`;
        } else {
            const valuesWithoutEmpty = p.values.filter(v => !v.isEmpty());
            const facetsWithOR = wikiContext.config.fs2gFacetsWithOR ?? [];
            if (facetsWithOR.includes(propertyTitle)) {
                cond = `[[${propertyTitle}::${valuesWithoutEmpty.join(' || ')}]]`;
            } else {
                cond = valuesWithoutEmpty.map(v => `[[${propertyTitle}::${v.toString()}]]`).join(' ');
            }
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
