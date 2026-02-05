import {useConfirm} from "react-use-confirming-dialog";
import {useContext} from "react";
import {WikiContext} from "../index";

export function initCallFinishedDialog() {
    const callFinishedDialog = useConfirm();
    const wikiContext = useContext(WikiContext);
    return async (status: string, result: any) => {

        if (status === 'success') {
            await callFinishedDialog({
                title: wikiContext.msg('fs-operation-successful'),
                message: '',
                confirmText: wikiContext.msg('fs-ok'),
                cancelText: wikiContext.msg('fs-cancel'),
            });

        } else {
            console.error(result);
            await callFinishedDialog({
                title: wikiContext.msg('fs-error-message'),
                message: wikiContext.msg('fs-generic-error-message'),
                confirmText: wikiContext.msg('fs-ok'),
                cancelText: wikiContext.msg('fs-cancel'),
            })
        }
    };
}

export function initConfirmDialog(label: string, fullUrl: string, openNewTab: boolean, callEndpoint: (fullUrl: string) => void) {
    const confirm = useConfirm();
    const wikiContext = useContext(WikiContext);
    return async () => {
        const ok = await confirm({
            title: wikiContext.msg('fs-please-confirm'),
            message: label + '?',
            confirmText: wikiContext.msg('fs-ok'),
            cancelText: wikiContext.msg('fs-cancel'),
        });

        if (ok) {
            if (openNewTab) {
                window.open(fullUrl, '_blank');
            } else {
                callEndpoint(fullUrl);
            }
        }
    };
}