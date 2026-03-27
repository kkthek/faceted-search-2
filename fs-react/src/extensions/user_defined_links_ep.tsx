import React from "react";

import {Document} from "../common/response/document";
import Client from "../common/client";

function UserDefinedLinksExtensionPoint(prop: {
    doc: Document,
    client: Client
}) {
    return <>
        {/* Put your extension components here */}
    </>;
}

export default UserDefinedLinksExtensionPoint;