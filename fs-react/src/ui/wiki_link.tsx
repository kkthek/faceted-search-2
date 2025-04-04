import {ElementWithURL} from "../common/datatypes";
import React from "react";


function WikiLink(prop: {
    page: ElementWithURL
}) {
    return <a href={prop.page.url}>{prop.page.displayTitle}</a>
}

export default WikiLink;