import {NamespaceFacetCount} from "../../common/datatypes";
import React, {useContext, useState} from "react";
import {WikiContext} from "../../index";
import EventHandler, {SearchStateDocument} from "../../common/event_handler";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import FacetWithCount from "../common/facet_with_count";
import ConfigUtils from "../../util/config_utils";

function NamespaceFacet(prop: {
    namespaceFacetCount: NamespaceFacetCount | null,

}) {
    const wikiContext = useContext(WikiContext);
    const namespaces = wikiContext.config['wgFormattedNamespaces'];


    let namespaceText = namespaces[prop.namespaceFacetCount.namespace] ?? 'unknown namespace';
    namespaceText = namespaceText === '' ? 'Main' : namespaceText;
    const countText = prop.namespaceFacetCount.count > 0 ? prop.namespaceFacetCount.count : undefined;

    return <ToggleButton sx={{marginTop: '3px'}}
                         size={'small'}
                         value={prop.namespaceFacetCount.namespace}>
        <FacetWithCount displayTitle={namespaceText} count={countText}/>
    </ToggleButton>
}

function NamespaceView(prop: {
    searchStateDocument: SearchStateDocument,
    eventHandler: EventHandler
}) {
    if (!prop.searchStateDocument) return;
    const wikiContext = useContext(WikiContext);
    const showNamespaces = wikiContext.config['fs2gShowNamespaces'];
    if (!showNamespaces) return;
    const namespacesFromWiki = wikiContext.config['wgFormattedNamespaces'];

    const [namespaces, setNamespaces] = useState([] as number[]);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        namespaces: number[],
    ) => {
        prop.eventHandler.onNamespaceClick(namespaces)
        setNamespaces(namespaces);
    };

    const documentsResponse = prop.searchStateDocument.documentResponse;
    const namespaceFacetCounts = documentsResponse.namespaceFacetCounts;

    for (let ns in namespacesFromWiki) {
        const nsAsNumber = parseInt(ns);
        if (!documentsResponse.containsNamespace(nsAsNumber)) {
            namespaceFacetCounts.push(new NamespaceFacetCount(nsAsNumber, namespacesFromWiki[ns], 0))
        }
    }

    const listItems = namespaceFacetCounts
        .filter(facetCount => ConfigUtils.containsOrEmpty(wikiContext.config['fs2gNamespacesToShow'], facetCount.namespace))
        .sort((a: NamespaceFacetCount, b: NamespaceFacetCount) =>
            wikiContext.config['fs2gNamespacesToShow'].indexOf(a.namespace)
            - wikiContext.config['fs2gNamespacesToShow'].indexOf(b.namespace))
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