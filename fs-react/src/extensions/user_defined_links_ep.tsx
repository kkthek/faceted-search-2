import React from "react";
import {Document} from "../common/datatypes";

function UserDefinedLinksExtensionPoint(prop: {
    doc: Document
}) {
    return <React.Fragment>
        {/* Put your extension components here */}
    </React.Fragment>;
}

export default UserDefinedLinksExtensionPoint;