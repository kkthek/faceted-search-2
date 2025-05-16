import {NamespaceFacetCount} from "../common/datatypes";
import React, {useContext, useState} from "react";
import {WikiContext} from "../index";
import {SearchStateDocument} from "../common/event_handler";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";

function NamespaceFacet(prop: {
    namespaceFacetCount: NamespaceFacetCount | null,

}) {
    let wikiContext = useContext(WikiContext);
    let namespaces = wikiContext.config['wgFormattedNamespaces'];


    let namespaceText = namespaces[prop.namespaceFacetCount.namespace] ?? 'unknown namespace';
    let countText = prop.namespaceFacetCount.count > 0 ? "("+prop.namespaceFacetCount.count+")" : '';

    namespaceText = namespaceText === '' ? 'Main' : namespaceText;
    return <ToggleButton sx={{marginTop: '3px'}}
                         size={'small'}
                         value={prop.namespaceFacetCount.namespace}>{countText}&nbsp;{namespaceText}</ToggleButton>
}

function NamespaceView(prop: {
    searchStateDocument: SearchStateDocument,
    onNamespaceClick: (namespaces: number[]) => void,
}) {
    if (!prop.searchStateDocument) return;
    let wikiContext = useContext(WikiContext);
    let showNamespaces = wikiContext.config['fs2gShowNamespaces'];
    if (!showNamespaces) return;
    let namespacesFromWiki = wikiContext.config['wgFormattedNamespaces'];

    const [namespaces, setNamespaces] = useState([] as number[]);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        namespaces: number[],
    ) => {
        prop.onNamespaceClick(namespaces)
        setNamespaces(namespaces);
    };

    let documentsResponse = prop.searchStateDocument.documentResponse;
    const namespaceFacetCounts = documentsResponse.namespaceFacetCounts;

    for (let ns in namespacesFromWiki) {
        let nsAsNumber = parseInt(ns);
        if (!documentsResponse.containsNamespace(nsAsNumber)) {
            namespaceFacetCounts.push(new NamespaceFacetCount(nsAsNumber, namespacesFromWiki[ns], 0))
        }
    }

    const listItems = namespaceFacetCounts
        .filter(facetCount => wikiContext.config['fs2gNamespacesToShow'].length === 0 ||
            wikiContext.config['fs2gNamespacesToShow'].includes(facetCount.namespace))
        .map((facetCount, i) => {
            return <NamespaceFacet key={facetCount.namespace} namespaceFacetCount={facetCount} />
    });
    return <div id={'fs-namespaces'} className={'fs-boxes'}>
        <ToggleButtonGroup value={namespaces}
                           onChange={handleChange}
                           size="small"
                           sx={{'display': 'block'}}
        >
            {listItems}
        </ToggleButtonGroup>
    </div>;
}

export default NamespaceView;