import { Link } from "@mui/material";
import {ElementWithURL} from "../../common/datatypes";
import React from "react";
import DisplayTools from "../../util/display_tools";


function WikiLink(prop: {
    page: ElementWithURL
}) {
    if (!prop.page) return;
    return <Link className={'fs-wiki-title'} href={prop.page.getUrl()}>{DisplayTools.getDisplayTitle(prop.page)}</Link>
}

export default WikiLink;