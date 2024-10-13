import {NamespaceFacetCount, NamespaceFacetValue, SolrDocumentsResponse} from "../common/datatypes";
import Tools from "../util/tools";
import React, {useContext} from "react";
import {WikiContext} from "../index";
import {SearchStateDocument} from "./event_handler";

function FacetViewNamespace( prop: {
    title: string,
    namespaceFacetCount: NamespaceFacetCount|null,
    selectedNamespace: number,
    onNamespaceClick: (c: number)=>void,
}) {
    let wikiContext = useContext(WikiContext);
    let namespaces = wikiContext['wgFormattedNamespaces'];
    let isSelected = prop.selectedNamespace == prop.namespaceFacetCount.namespace;
    return <span className={isSelected ? 'fs-namespace-selected': '' } onClick={() => prop.onNamespaceClick(prop.namespaceFacetCount.namespace)}>
        ({prop.namespaceFacetCount.count}) {namespaces[prop.namespaceFacetCount.namespace]}
    </span>
}
function NamespaceView( prop: {
    searchStateDocument: SearchStateDocument,
    onNamespaceClick: (c: number)=>void,

}) {
    if (!prop.searchStateDocument) return;

    let namespaces = prop.searchStateDocument.documentResponse.docs.flatMap((doc, i) => {
        return doc.namespaceFacet;
    });
    const uniqueNamespaces = Tools.createUniqueArray(namespaces, (p: NamespaceFacetValue) => { return p.namespace.toString() });

    const listItems = uniqueNamespaces.map((ns,i) => {
            const facetCount = Tools.findFirst(prop.searchStateDocument.documentResponse.namespaceFacetCounts,
                (c) => c.namespace.toString(), ns.namespace.toString());

            return <FacetViewNamespace key={ns.namespace}
                                      title={ns.displayTitle}
                                       namespaceFacetCount={facetCount}
                                       onNamespaceClick={prop.onNamespaceClick}
                                       selectedNamespace={prop.searchStateDocument.query.namespaceFacets[0]}
            />
        }
    );
    return <div id={'fs-categoryview'}>
        <ul>
            {listItems}
        </ul>
    </div>;
}

export default NamespaceView;