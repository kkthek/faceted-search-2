import React, {useContext} from "react";
import {WikiContext} from "../../index";
import {Link} from "@mui/material";
import Box from "@mui/material/Box";

function CreateArticleLink(prop: {
    searchText: string
}) {
    const wikiContext = useContext(WikiContext);
    const createNewPageLink = wikiContext.config['fs2gCreateNewPageLink'];
    if (!createNewPageLink) return;
    if (prop.searchText === '') return;

    const wgServer = wikiContext.config['wgServer'];
    const wgArticlePath = wikiContext.config['wgArticlePath'];

    let articleUrl = wgServer+wgArticlePath;
    articleUrl = articleUrl.replace(/\$1/g, encodeURIComponent(prop.searchText)) + createNewPageLink;
    return <Box className={'fs-create-article'}>
            <Link target="_blank" href={articleUrl}>{wikiContext.msg('fs-create-article')}: {prop.searchText}</Link>
    </Box>

}

export default CreateArticleLink;