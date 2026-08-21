import React, {useContext, useState} from "react";
import {Box, Link, Stack} from "@mui/material";
import {WikiContext} from "../../index";
import {DocumentQuery} from "../../common/request/document_query";
import {encodeParameters} from "../../util/url_encoder";
import {generateAskQuery, getAskParams} from "../../util/ask_generator";
import ConfirmDialogSlide, {ConfirmDialogState} from "../../util/confirm_dialog";
import downloadURLWithTimestamp from "../../util/file_utils";

function ExportSearchAsQuery(prop: {
    documentQuery: DocumentQuery
}) {
    const wikiContext = useContext(WikiContext);
    const [confirmDialogState, setConfirmDialogState] = useState<ConfirmDialogState>({open: false});
    if (!wikiContext.config['fs2gShowExportLinks']) {
        return;
    }

    const baseUrl = wikiContext.getArticleUrl('Special:Ask');
    const queryParams = {
        '': generateAskQuery(prop.documentQuery, wikiContext),
        ...getAskParams(prop.documentQuery, wikiContext)
    }
    const urlParamsJson = encodeParameters({...queryParams, 'format': 'json'});
    const urlParamsCsv = encodeParameters({...queryParams, 'format': 'csv'});

    const getFilename = (type: string) => {
        switch (type) {
            case 'json':
                return 'export.json';
            case 'csv':
                return 'export.csv';
            default:
                return 'export';
        }
    }
    const onClick = (url: string, type: string) => (event: React.MouseEvent) => {
        event.preventDefault();

        if (prop.documentQuery.searchText !== '') {
            setConfirmDialogState({
                open: true,
                message: wikiContext.msg('fs-export-search-text-warning'),
                data: {
                    url: url,
                    type: type
                }
            });
            return;
        }

        downloadURLWithTimestamp(url, getFilename(type));
    };

    const onOk = () => {
        const url = confirmDialogState.data.url;
        const type = confirmDialogState.data.type;
        downloadURLWithTimestamp(url, getFilename(type));
        setConfirmDialogState({open: false});
    }

    const onCancel = () => {
        setConfirmDialogState({open: false});
    }

    return <Box className={'fs-export-as-json'}>
        <Stack direction="row" spacing={2}>
            <Link onClick={onClick(baseUrl + '/' + urlParamsJson, 'json')}
                  title={wikiContext.msg('fs-export-as-json')}>JSON</Link>
            <Link onClick={onClick(baseUrl + '/' + urlParamsCsv, 'csv')}
                  title={wikiContext.msg('fs-export-as-csv')}>CSV</Link>
        </Stack>
        <ConfirmDialogSlide state={confirmDialogState}
                            callbackOnOk={onOk}
                            callbackOnCancel={onCancel}
        />
    </Box>;

}

export default ExportSearchAsQuery;