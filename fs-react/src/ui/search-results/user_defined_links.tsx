import React, {useContext} from "react";
import {WikiContext} from "../../index";
import ValueSerializer from "../../util/value_serializer";
import UserDefinedLinksExtensionPoint from "../../extensions/user_defined_links_ep";
import ConfigUtils from "../../util/config_utils";
import {Document} from "../../common/response/document";
import Client from "../../common/client";
import RequestLoader from "./request_loader";

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
    categories.forEach((c) => {
        if (prop.doc.getCategoryFacetValue(c) === null) {
            return;
        }
        const links = additionalLinks[c];
        allLinks = {...allLinks, ...links};
    });

    const items = [];
    const linkConfigUtil = new LinkConfigAccessor(allLinks);

    for (const label in allLinks) {
        const url = linkConfigUtil.getUrl(label);
        let fullUrl = wgServer + wgScriptPath + "/" + url;
        fullUrl = ConfigUtils.replaceSMWVariables(prop.doc, fullUrl);
        fullUrl = ConfigUtils.replaceMagicWords(prop.doc, fullUrl, wikiContext);

        const openNewTab = linkConfigUtil.shouldOpenNewTab(label);
        let shouldConfirm = linkConfigUtil.shouldConfirm(label);
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
        <UserDefinedLinksExtensionPoint doc={prop.doc}/>
    </>
}

export default UserDefinedLinks;