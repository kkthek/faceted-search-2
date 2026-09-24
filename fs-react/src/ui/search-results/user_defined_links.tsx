import React, {useContext} from "react";
import UserDefinedLinksExtensionPoint from "../../extensions/user_defined_links_ep";
import {Document} from "app/common/response/document";
import {WikiContext} from "app/index";
import Client from "app/common/client";
import ConfigUtils from "app/util/config_utils";
import RequestLoader from "app/ui/search-results/request_loader";
import ValueSerializer from "app/util/value_serializer";

interface LinkConfig {
    [key: string]: string | ActionLink;
}

class ActionLink {
    url: string;
    confirm: boolean;
    openNewTab: boolean;
}

class LinkConfigAccessor {

    private readonly config: LinkConfig;

    constructor(config: LinkConfig) {
        this.config = config;
    }

    getUrl(key: string): string {
        const config = this.config[key] as ActionLink;
        return config?.url ?? this.config[key] as string;
    }

    shouldConfirm(key: string): boolean {
        const config = this.config[key] as ActionLink;
        return config?.confirm ?? false;
    }

    shouldOpenNewTab(key: string): boolean {
        const config = this.config[key] as ActionLink;
        return config?.openNewTab ?? true;
    }
}

function UserDefinedLinks(prop: { doc: Document, client: Client }) {

    const wikiContext = useContext(WikiContext);
    const wgServer = wikiContext.config["wgServer"];
    const wgScriptPath = wikiContext.config["wgScriptPath"];
    const additionalLinks = wikiContext.config['fs2gAdditionalLinks'];
    const categories = Object.keys(additionalLinks);

    let allLinks: LinkConfig = {};
    categories
        .filter(c => prop.doc.getCategoryFacetValue(c) !== null)
        .forEach((c) => allLinks = {...allLinks, ...additionalLinks[c]});

    const items = [];
    const linkConfigAccessor = new LinkConfigAccessor(allLinks);

    for (const label in allLinks) {
        const url = linkConfigAccessor.getUrl(label);
        let fullUrl = wgServer + wgScriptPath + "/" + url;
        fullUrl = ConfigUtils.replaceSMWVariables(prop.doc, fullUrl);
        fullUrl = ConfigUtils.replaceMagicWords(prop.doc, fullUrl, wikiContext);

        const openNewTab = linkConfigAccessor.shouldOpenNewTab(label);
        const shouldConfirm = linkConfigAccessor.shouldConfirm(label);
        items.push(<RequestLoader label={label}
                                  key={label}
                                  client={prop.client}
                                  doc={prop.doc}
                                  fullUrl={fullUrl}
                                  showConfirm={shouldConfirm}
                                  openNewTab={openNewTab}
        />);
    }
    return <>
        {ValueSerializer.join(items, ' ')}
        <UserDefinedLinksExtensionPoint doc={prop.doc} client={prop.client}/>
    </>
}

export default UserDefinedLinks;