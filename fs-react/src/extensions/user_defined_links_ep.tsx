import React from "react";

import {Document} from "app/common/response/document";
import Client from "app/common/client";


function UserDefinedLinksExtensionPoint(prop: {
    doc: Document,
    client: Client
}) {
    return <>
        {/* Put your extension components here */}
    </>;
}

export default UserDefinedLinksExtensionPoint;