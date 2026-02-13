import React, {useContext, useState} from "react";
import {BarLoader} from "react-spinners";
import Client from "../../common/client";
import {Link} from "@mui/material";
import {Document} from "../../common/response/document";
import Loader from "../../util/loader";
import AlertDialogSlide, {AlertDialogState} from "../../util/alert_dialog";
import ConfirmDialogSlide, {ConfirmDialogState} from "../../util/confirm_dialog";
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
    const [openConfirm, setOpenConfirm] = useState<ConfirmDialogState>({ open: false});
    const [openAlert, setOpenAlert] = useState<AlertDialogState>({open: false});

    const openResponseDialog = (status: string, response: any) => {
        if (status !== 'success') {
            setOpenAlert({open: true, message: wikiContext.msg('fs-generic-error-message')});
            console.error(response);
        } else {
            setOpenAlert({open: true, message: wikiContext.msg('fs-operation-successful')});
        }
    }
    const openConfirmDialog = () => setOpenConfirm({open: true, message: prop.label + '?'});

    const doRequest = () => setLoadPromise(prop.client.postCustomEndpoint(prop.fullUrl)
        .then(response => openResponseDialog('success', response))
        .catch(error => openResponseDialog('error', error)));

    let onClick;
    let href;
    if (prop.showConfirm || !prop.openNewTab) {
        onClick = prop.showConfirm ? openConfirmDialog : doRequest;
    } else {
        href = prop.fullUrl;
    }

    const callbackOnConfirmOk = () => {
        setOpenConfirm({open: false});
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
        <ConfirmDialogSlide state={openConfirm}
                            callbackOnOk={callbackOnConfirmOk}
                            callbackOnCancel={() => setOpenConfirm({open: false})}
        />
        <AlertDialogSlide state={openAlert}
                          callbackOnOk={() => setOpenAlert({open: false})}

        />
    </>

}

export default RequestLoader