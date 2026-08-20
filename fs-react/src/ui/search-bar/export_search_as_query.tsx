import React, {useContext} from "react";
import {Box, Link, Stack} from "@mui/material";
import {WikiContext} from "../../index";
import {DocumentQuery} from "../../common/request/document_query";
import {encodeParameters} from "../../util/url_encoder";
import {generateAskQuery, getAskParams} from "../../util/ask_generator";

function ExportSearchAsQuery(prop: {
    documentQuery: DocumentQuery
}) {
    const wikiContext = useContext(WikiContext);
    if (!wikiContext.config['fs2gShowExportLinks']) {
        return;
    }

    const baseUrl = wikiContext.config['wgServer'] + wikiContext.config['wgArticlePath'];
    const specialAskUrl = baseUrl.replace(/\$1/, 'Special:Ask');
    const queryParams = {
        '': generateAskQuery(prop.documentQuery, wikiContext),
        ...getAskParams(prop.documentQuery, wikiContext)
    }
    const urlParamsJson = encodeParameters({...queryParams, 'format': 'json' });
    const urlParamsCsv = encodeParameters({...queryParams, 'format': 'csv' });

    return <Box className={'fs-export-as-json'}>
        <Stack direction="row" spacing={2}>
            <Link href={specialAskUrl + '/' + urlParamsJson} title={wikiContext.msg('fs-export-as-json')}>JSON</Link>
            <Link href={specialAskUrl + '/' + urlParamsCsv} title={wikiContext.msg('fs-export-as-csv')}>CSV</Link>
        </Stack>
    </Box>;

}

export default ExportSearchAsQuery;