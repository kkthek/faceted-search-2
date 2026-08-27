import React, {useContext, useState} from "react";
import {Box, Link, Stack} from "@mui/material";
import {WikiContext} from "../../index";
import {DocumentQuery} from "../../common/request/document_query";
import {encodeParameters} from "../../util/url_encoder";
import {generateAskQuery, getAskParams} from "../../util/ask_generator";
import ConfirmDialogSlide, {ConfirmDialogState} from "../../util/confirm_dialog";
import downloadURL from "../../util/file_utils";
import DateTools from "../../util/date_tools";

function ExportSearchAsQuery(prop: {
    documentQuery: DocumentQuery
}) {
    const wikiContext = useContext(WikiContext);
    const [confirmDialogState, setConfirmDialogState] = useState<ConfirmDialogState>({open: false});
    const exportLinks = wikiContext.config['fs2gExportLinkFormats'] ?? [];
    if (exportLinks.length === 0) {
        return;
    }

    const baseUrl = wikiContext.getArticleUrl('Special:Ask');
    const queryParams = {
        '': generateAskQuery(prop.documentQuery, wikiContext),
        ...getAskParams(prop.documentQuery, wikiContext)
    }

    const getFilename = (type: string) => {
        const timestamp = DateTools.formatTimestamp(new Date());
        return `export_${timestamp}.${type}`;
    }

    const showFulltextFilterWarning = (url: string, type: string) => {
        setConfirmDialogState({
            open: true,
            message: wikiContext.msg('fs-export-search-text-warning'),
            data: {
                url: url,
                type: type
            }
        });
    }

    const onClick = (url: string, type: string) => (event: React.MouseEvent) => {
        event.preventDefault();

        if (prop.documentQuery.searchText !== '') {
            showFulltextFilterWarning(url, type);
            return;
        }

        downloadURL(url, getFilename(type));
    };

    const onOk = () => {
        const url = confirmDialogState.data.url;
        const type = confirmDialogState.data.type;
        downloadURL(url, getFilename(type));
        setConfirmDialogState({open: false});
    }

    const onCancel = () => {
        setConfirmDialogState({open: false});
    }

    return <Box className={'fs-export-link-box'}>
        <Stack direction="row" spacing={2}>
            {exportLinks.map((format: string) => {
                const url = baseUrl + '/' + encodeParameters({
                    ...queryParams,
                    format: format
                });
                return <Link className={'fs-export-link'}
                             key={'export-as-query-'+format}
                             href={url}
                             onClick={onClick(url, format)}
                             title={wikiContext.msg('fs-export-as-json')}>
                    {format.toUpperCase()}
                </Link>;
            })
            }
        </Stack>
        <ConfirmDialogSlide state={confirmDialogState}
                            callbackOnOk={onOk}
                            callbackOnCancel={onCancel}
        />
    </Box>;

}

export default ExportSearchAsQuery;