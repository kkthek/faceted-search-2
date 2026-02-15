import React, {useContext, useState} from "react";
import {WikiContext} from "../../index";
import EventHandler from "../../common/event_handler";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import FacetWithCount from "../common/facet_with_count";
import {NamespaceFacetCount} from "../../common/response/namespace_facet_count";
import ConfigUtils from "../../util/config_utils";
import {SearchStateDocument} from "../../common/datatypes";

function NamespaceFacet(prop: {
    namespaceFacetCount: NamespaceFacetCount | null,

}) {
    const wikiContext = useContext(WikiContext);
    const namespaces = wikiContext.config['wgFormattedNamespaces'];


    const namespaceIndex = prop.namespaceFacetCount.namespace;
    let namespaceText = namespaces[namespaceIndex] ?? 'unknown namespace: ' + namespaceIndex;
    namespaceText = namespaceText === '' ? wikiContext.msg('fs-main-namespace') : namespaceText;
    const countText = prop.namespaceFacetCount.count > 0 ? prop.namespaceFacetCount.count : undefined;

    return <ToggleButton sx={{marginTop: '3px'}}
                         size={'small'}
                         value={namespaceIndex}>
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

    if (wikiContext.config['fs2gShowEmptyNamespaces']) {
        Object.keys(namespacesFromWiki)
            .map(ns => parseInt(ns))
            .filter(ns => !documentsResponse.containsNamespace(ns))
            .forEach(ns => namespaceFacetCounts.push(new NamespaceFacetCount(ns, namespacesFromWiki[ns], 0)));
    }

    const namespacesToShow = wikiContext.config['fs2gNamespacesToShow'];
    const listItems = namespaceFacetCounts
        .filter(facetCount => namespacesToShow.containsOrEmpty(facetCount.namespace))
        .sort(ConfigUtils.getSortFunction(wikiContext.options['fs2-sort-order-preferences']))
        .map((facetCount) => {
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