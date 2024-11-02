import {NamespaceFacetCount} from "../common/datatypes";
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
    return <span className={isSelected ? 'fs-namespace-selected': '' }
                 onClick={() => prop.onNamespaceClick(prop.namespaceFacetCount.namespace)}>
        ({prop.namespaceFacetCount.count}) {namespaces[prop.namespaceFacetCount.namespace]}
    </span>
}
function NamespaceView( prop: {
    searchStateDocument: SearchStateDocument,
    onNamespaceClick: (c: number)=>void,
}) {
    if (!prop.searchStateDocument) return;

    const uniqueNamespaces = prop.searchStateDocument.documentResponse.getUniqueNamespaces();

    const listItems = uniqueNamespaces.map((ns,i) => {
            const facetCount = prop.searchStateDocument.documentResponse.getNamespaceFacetCount(ns.namespace);

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