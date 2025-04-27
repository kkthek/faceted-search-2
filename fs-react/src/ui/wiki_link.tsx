import {ElementWithURL} from "../common/datatypes";
import React from "react";


function WikiLink(prop: {
    page: ElementWithURL
}) {
    if (!prop.page) return;
    return <a className={'fs-wiki-title'} href={prop.page.url}>{prop.page.displayTitle}</a>
}

export default WikiLink;