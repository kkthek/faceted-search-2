import {Link} from "@mui/material";
import {ElementWithURL} from "app/common/datatypes";
import React, {useContext} from "react";
import DisplayTools from "app/util/display_tools";
import {WikiContext} from "app/index";


function WikiLink(prop: {
    page: ElementWithURL
}) {
    const wikiContext = useContext(WikiContext);
    if (!prop.page) return;

    return <Link className={'fs-wiki-title'} href={prop.page.getUrl()}>
        {DisplayTools.getDisplayTitle(prop.page, wikiContext)}
    </Link>
}

export default WikiLink;