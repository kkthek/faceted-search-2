import { Link } from "@mui/material";
import {ElementWithURL} from "../../common/datatypes";
import React from "react";


function WikiLink(prop: {
    page: ElementWithURL
}) {
    if (!prop.page) return;
    return <Link className={'fs-wiki-title'} href={prop.page.url}>{prop.page.getDisplayTitle()}</Link>
}

export default WikiLink;