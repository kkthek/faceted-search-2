import React, {useContext, useState} from "react";
import {BarLoader} from "react-spinners";
import Client from "../../common/client";
import {Link} from "@mui/material";
import {Document} from "../../common/response/document";
import Loader from "../../util/loader";
import AlertDialogSlide, {AlertDialogState} from "../../util/alert_dialog";
import ConfirmDialogSlide from "../../util/confirm_dialog";
import {WikiContext} from "../../index";

const RequestLoader = (prop: {
    client: Client,
    doc: Document,
    label: string,
    fullUrl: string,
    showConfirm: boolean,
    openNewTab: boolean
}) => {
    const wikiContext = useContext(WikiContext);
    const [loadPromise, setLoadPromise] = useState<Promise<any>>(null);
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState<AlertDialogState>({open: false, message: ''});
    const showCallFinishedDialog = (status: string, response: any) => {
        if (status !== 'success') {
            setOpenAlert({open: true, message: wikiContext.msg('fs-generic-error-message')});
            console.error(response);
        } else {
            setOpenAlert({open: true, message: wikiContext.msg('fs-operation-successful')});
        }
    }

    const doRequest = () => setLoadPromise(prop.client.postCustomEndpoint(prop.fullUrl)
        .then(response => showCallFinishedDialog('success', response))
        .catch(error => showCallFinishedDialog('error', error)));

    let onClick;
    let href;
    if (prop.showConfirm || !prop.openNewTab) {
        onClick = prop.showConfirm ? () => setOpenConfirm(true) : doRequest;
    } else {
        href = prop.fullUrl;
    }

    const callbackOnConfirmOk = () => {
        setOpenConfirm(false);
        if (prop.openNewTab) {
            window.open(prop.fullUrl, '_blank');
        } else {
            doRequest();
        }
    };

    return <>
        <Link sx={{cursor: 'pointer'}}
              key={prop.doc.id + prop.label}
              onClick={onClick}
              href={href}
        >{`[${prop.label}]`}
        </Link>
        {loadPromise ? <Loader loadPromise={loadPromise} loaderComponent={<BarLoader/>}/> : undefined}
        <ConfirmDialogSlide label={prop.label}
                            open={openConfirm}
                            callbackOnOk={callbackOnConfirmOk}
                            callbackOnCancel={() => setOpenConfirm(false)}
        />
        <AlertDialogSlide state={openAlert}
                          callbackOnOk={() => setOpenAlert({open: false, message: ''})}

        />
    </>

}

export default RequestLoader