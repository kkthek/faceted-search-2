import React, {useContext} from "react";
import {WikiContext} from "../index";

function CreateArticleLink(prop: {
    searchText: string
}) {
    let wikiContext = useContext(WikiContext);
    let createNewPageLink = wikiContext.config['fs2gCreateNewPageLink'];
    if (!createNewPageLink) return;
    if (prop.searchText === '') return;

    let wgServer = wikiContext.config['wgServer'];
    let wgArticlePath = wikiContext.config['wgArticlePath'];

    let articleUrl = wgServer+wgArticlePath;
    articleUrl = articleUrl.replace(/\$1/g, encodeURIComponent(prop.searchText)) + createNewPageLink;
    return <div className={'fs-create-article'}>
        <span>{wikiContext.msg('fs-create-article')}: <a target="_blank" href={articleUrl}>{prop.searchText}</a></span>
    </div>

}

export default CreateArticleLink;