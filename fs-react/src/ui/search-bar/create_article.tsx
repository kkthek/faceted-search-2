import React, {useContext} from "react";
import {WikiContext} from "../../index";
import {Link} from "@mui/material";
import Box from "@mui/material/Box";
import {SearchStateDocument} from "../../common/datatypes";

function CreateArticleLink(prop: {
    searchStateDocument: SearchStateDocument
}) {
    const wikiContext = useContext(WikiContext);
    const createNewPageLink = wikiContext.config['fs2gCreateNewPageLink'];
    if (!createNewPageLink
        || !prop.searchStateDocument
        || prop.searchStateDocument.query.searchText === ''
        || prop.searchStateDocument.documentResponse.titleExists === undefined
        || prop.searchStateDocument.documentResponse.titleExists) {
        return;
    }
    console.log(prop.searchStateDocument.documentResponse.titleExists)
    const wgServer = wikiContext.config['wgServer'];
    const wgArticlePath = wikiContext.config['wgArticlePath'];

    const titleText = prop.searchStateDocument.query.searchText;
    let articleUrl = wgServer+wgArticlePath;
    articleUrl = articleUrl.replace(/\$1/g, encodeURIComponent(titleText)) + createNewPageLink;
    return <Box className={'fs-create-article'}>
            <Link target="_blank" href={articleUrl}>{wikiContext.msg('fs-create-article')}: {titleText}</Link>
    </Box>

}

export default CreateArticleLink;