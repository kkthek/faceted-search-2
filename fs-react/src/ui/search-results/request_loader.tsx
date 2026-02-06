import React, {Suspense, use, useState} from "react";
import {BarLoader} from "react-spinners";
import {initCallFinishedDialog, initConfirmDialog} from "../../util/confirm_dialogs";
import Client from "../../common/client";
import {Link} from "@mui/material";
import {Document} from "../../common/response/document";

const RequestLoader = (prop: {
    client: Client,
    doc: Document,
    label: string,
    fullUrl: string,
    showConfirm: boolean,
    openNewTab: boolean
}) => {

    const [loadPromise, setLoadPromise] = useState<Promise<any>>(null);
    const showCallFinishedDialog = initCallFinishedDialog();

    const message = prop.label + '?';
    const showConfirmDialog = initConfirmDialog(message, () => {
        if (prop.openNewTab) {
            window.open(prop.fullUrl, '_blank');
        } else {
            doRequest();
        }
    });

    const doRequest = () => setLoadPromise(prop.client.postCustomEndpoint(prop.fullUrl)
        .then(response => showCallFinishedDialog('success', response))
        .catch(error => showCallFinishedDialog('error', error)));

    let onClick;
    let href;
    if (prop.showConfirm || !prop.openNewTab) {
        onClick = prop.showConfirm ? showConfirmDialog : doRequest;
    } else {
        href = prop.fullUrl;
    }

    return <>
        <Link sx={{cursor: 'pointer'}}
              key={prop.doc.id + prop.label}
              onClick={onClick}
              href={href}
        >{`[${prop.label}]`}
        </Link>
        {loadPromise ? <Suspense fallback={<BarLoader/>}><Loader
            loadPromise={loadPromise}></Loader></Suspense> : undefined}
    </>

}

function Loader(prop: { loadPromise: Promise<any> }) {
    use(prop.loadPromise);
    return <></>;
}

export default RequestLoader