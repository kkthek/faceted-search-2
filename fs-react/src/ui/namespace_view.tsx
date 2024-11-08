import {NamespaceFacetCount} from "../common/datatypes";
import React, {useContext} from "react";
import {WikiContext} from "../index";
import {SearchStateDocument} from "./event_handler";

function FacetViewNamespace( prop: {
    namespaceFacetCount: NamespaceFacetCount|null,
    selectedNamespace: number,
    onNamespaceClick: (c: number)=>void,
}) {
    let wikiContext = useContext(WikiContext);
    let namespaces = wikiContext['wgFormattedNamespaces'];
    let isSelected = prop.selectedNamespace == prop.namespaceFacetCount.namespace;
    let namespaceText = namespaces[prop.namespaceFacetCount.namespace] ?? 'unknown namespace';
    return <span className={isSelected ? 'fs-namespace-selected': '' }
                 onClick={() => prop.onNamespaceClick(prop.namespaceFacetCount.namespace)}>
        ({prop.namespaceFacetCount.count}) {namespaceText}
    </span>
}
function NamespaceView( prop: {
    searchStateDocument: SearchStateDocument,
    onNamespaceClick: (c: number)=>void,
}) {
    if (!prop.searchStateDocument) return;

    const namespaceFacetCounts = prop.searchStateDocument.documentResponse.namespaceFacetCounts;

    const listItems = namespaceFacetCounts.map((facetCount,i) => {

            return <FacetViewNamespace key={facetCount.namespace}
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