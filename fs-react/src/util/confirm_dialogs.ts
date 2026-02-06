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
                dialogTextFont: '"Roboto","Helvetica","Arial",sans-serif',
                cancelTextFont: '"Roboto","Helvetica","Arial",sans-serif',
                confirmTextFont: '"Roboto","Helvetica","Arial",sans-serif'
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

export function initConfirmDialog(message: string, callback: () => void) {
    const confirm = useConfirm();
    const wikiContext = useContext(WikiContext);
    return async () => {
        const ok = await confirm({
            title: wikiContext.msg('fs-please-confirm'),
            message: message,
            confirmText: wikiContext.msg('fs-ok'),
            cancelText: wikiContext.msg('fs-cancel'),
            dialogTextFont: '"Roboto","Helvetica","Arial",sans-serif',
            cancelTextFont: '"Roboto","Helvetica","Arial",sans-serif',
            confirmTextFont: '"Roboto","Helvetica","Arial",sans-serif'
        });

        if (ok) {
            callback();
        }
    };
}