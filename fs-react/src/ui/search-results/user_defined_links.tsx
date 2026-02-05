import React, {useContext} from "react";
import {WikiContext} from "../../index";
import ValueSerializer from "../../util/value_serializer";
import {Link} from "@mui/material";
import UserDefinedLinksExtensionPoint from "../../extensions/user_defined_links_ep";
import ConfigUtils from "../../util/config_utils";
import {Document} from "../../common/response/document";
import Client from "../../common/client";
import {initCallFinishedDialog, initConfirmDialog} from "../../util/confirm_dialogs";

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

    const showCallFinishedDialog = initCallFinishedDialog();
    const callPostEndpoint = (fullUrl: string) => {
        prop.client.postCustomEndpoint(fullUrl).then(
            (response) => showCallFinishedDialog('success', response),
            (error) => showCallFinishedDialog('error', error)
        )
    }

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
        if (linkConfigUtil.shouldConfirm(label)) {

            const message = label + '?';
            const showConfirmDialog = initConfirmDialog(message, () => {
                if (openNewTab) {
                    window.open(fullUrl, '_blank');
                } else {
                    callPostEndpoint(fullUrl);
                }
            });
            items.push(<Link sx={{cursor: 'pointer'}}
                             onClick={showConfirmDialog}
                             key={prop.doc.id + label}>
                {`[${label}]`}
            </Link>);

        } else {

            if (openNewTab) {
                items.push(<Link key={prop.doc.id + label}
                                 target={'_blank'}
                                 href={fullUrl}>
                    {`[${label}]`
                    }</Link>);
            } else {
                items.push(<Link sx={{cursor: 'pointer'}}
                                 key={prop.doc.id + label}
                                 onClick={() => callPostEndpoint(fullUrl)}>
                    {`[${label}]`}
                </Link>);
            }
        }
    }
    return <>
        {ValueSerializer.join(items, ' ')}
        <UserDefinedLinksExtensionPoint doc={prop.doc}/>
    </>
}

export default UserDefinedLinks;