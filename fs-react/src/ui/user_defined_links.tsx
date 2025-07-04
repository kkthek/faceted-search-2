import {Document} from "../common/datatypes";
import React, {useContext} from "react";
import {WikiContext} from "../index";
import ValueSerializer from "../util/value_serializer";
import {Box} from "@mui/material";
import UserDefinedLinksExtensionPoint from "../extensions/user_defined_links_ep";
import ConfigUtils from "../util/config_utils";

interface LinkConfig {
    [key: string]: string;
}

function UserDefinedLinks(prop: { doc: Document }) {
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
    for(let label in allLinks) {
        let url: string = allLinks[label];
        let fullUrl = wgServer + wgScriptPath + "/" + url;
        fullUrl = ConfigUtils.replaceSMWVariables(prop.doc, fullUrl);
        fullUrl = fullUrl.replace('{CurrentUser}', encodeURIComponent(wikiContext.username));
        items.push(<a key={prop.doc.id+label} href={fullUrl}>{`[${label}]`}</a>);
    }
    return <Box>
        {ValueSerializer.join(items, ' ')}
        <UserDefinedLinksExtensionPoint doc={prop.doc}/>
    </Box>
}

export default UserDefinedLinks;