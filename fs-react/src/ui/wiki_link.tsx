import {Document} from "../common/datatypes";
import React from "react";

function WikiLink(prop: {
    doc: Document
}) {
    return <a href={prop.doc.url}>{prop.doc.displayTitle}</a>
}

export default WikiLink;