import React from "react";
import {Document} from "../common/datatypes";

function UserDefinedLinksExtensionPoint(prop: {
    doc: Document
}) {
    return <span>
        {/* Put your extension components here */}
    </span>;
}

export default UserDefinedLinksExtensionPoint;