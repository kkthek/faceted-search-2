import React, {useContext} from "react";
import {Box, Link} from "@mui/material";
import {WikiContext} from "../../index";
import {DocumentQuery} from "../../common/request/document_query";
import {WikiContextAccessor} from "../../common/wiki_context";
import ConfigUtils from "../../util/config_utils";
import {Order} from "../../common/datatypes";

function SaveSearchAsQuery(prop: {
    documentQuery: DocumentQuery
}) {
    const wikiContext = useContext(WikiContext);

    const copyLinkToClipboard = function (event: React.MouseEvent<HTMLElement>) {

        navigator.clipboard.writeText(generateAsk(prop.documentQuery, wikiContext)).then(() => {
            const browserWindow = window as any;
            browserWindow.mw?.notify(wikiContext.msg('fs-copy-search-as-query'));
        });
        event.preventDefault();
    }

    return <Box className={'fs-save-search-as-query'}>
    <Link onClick={copyLinkToClipboard}>{wikiContext.msg('fs-save-search-as-query')}</Link>
    </Box>;
}

function generateAsk(query: DocumentQuery, wikiContext: WikiContextAccessor): string {
    let q = "{{#ask:\n";

    // Categories
    q += query.categoryFacets.map((category) =>
        `[[Category:${category}]]`
    ).join("\n");
    q += "\n";

    // Namespaces
    q += query.namespaceFacets.map((namespaceId) => {
        const namespaceAsText = ConfigUtils.getNamespaceAsText(wikiContext, namespaceId);
        return `[[${namespaceAsText}:+]]`;

    }).join("\n");
    q += "\n";

    // Properties
    q += query.propertyFacets.map((p) => {
        return p.values.map((v) => {
                if (v.isEmpty()) {
                    return `[[${p.property.title}::+]]`;
                } else if (p.property.isRangeProperty()) {
                    return `[[${p.property.title}::>=${v.range.fromToString()}]] [[${p.property.title}::<=${v.range.toToString()}]]`;
                } else {
                    return `[[${p.property.title}::${v.toString()}]]`;
                }
            }
        ).join("\n");
    }).join("\n");

    // Sorts
    const sortKey = query.sorts[0].getKey();
    if (sortKey !== 'score' && sortKey !== 'ascending' && sortKey !== 'descending') {
        // score and descending are not supported, ascending is default
        const sort = ConfigUtils.getSortByKeyOrDefault(sortKey);
        const fs2SMWLanguage = wikiContext.config['fs2gSMWLanguage'] ?? {};
        const sortInQuery = fs2SMWLanguage[sort.property.title] ?? sort.property.title;
        q += "\nsort="+sortInQuery;
        q += "\norder="+(sort.order === Order.asc ? 'asc' : 'desc');
    }

    q += "\n}}";
    return q.replace(/^\s*$(?:\r\n?|\n)/gm, '');
}

export default SaveSearchAsQuery;