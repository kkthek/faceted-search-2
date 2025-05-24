import {Document, MWTitle, MWTitleWithURL, ValueType} from "../common/datatypes";
import React, {useContext} from "react";
import {WikiContext} from "../index";
import ValueSerializer from "../util/value_serializer";
import {Box} from "@mui/material";

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
        fullUrl = replaceSMWVariables(prop.doc, fullUrl);
        fullUrl = fullUrl.replace('{CurrentUser}', encodeURIComponent(wikiContext.username));
        items.push(<a key={prop.doc.id+label} href={fullUrl}>{`[${label}]`}</a>);
    }
    return <Box>{ValueSerializer.join(items, ' ')}</Box>
}

function replaceSMWVariables(doc: Document, url: string) {

    const smwVariables = url.matchAll(/\{SMW:([^}]+)\}/gi);

    // @ts-ignore
    for (let smwVariable of smwVariables) {
        let propertyName = smwVariable[1];
        let pfv = doc.getPropertyFacetValues(propertyName);
        if (pfv === null) continue;

        let value = pfv.values.map((value: ValueType | MWTitleWithURL) => serialize(value)).join(',');
        url = url.replace(`{SMW:${propertyName}}`, encodeURIComponent(value));
    }

    return url;
}

function serialize(value: ValueType | MWTitleWithURL): string {
    let mwTitle = value as MWTitle;
    return mwTitle ? mwTitle.title : value.toString();
}

export default UserDefinedLinks;