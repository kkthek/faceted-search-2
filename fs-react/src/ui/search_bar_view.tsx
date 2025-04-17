import React, {useContext, useState} from "react";
import {WikiContext} from "../index";

function SearchBar(prop: {onClick: (text: string)=>void}) {
    let wikiContext = useContext(WikiContext);
    let placeholderText = wikiContext.config['fsg2PlaceholderText'];

    const [text, setText] = useState('');

    return <div id={'fs-searchbar'}>
        <input type={'text'} id={'fs-fulltext'}
               onChange={(e)=> setText(e.target.value)}
               placeholder={placeholderText}
        />
        <button id={'fs-fulltext-button'} onClick={() => prop.onClick(text)}>Search</button>
        <CreateArticleLink searchText={text}/>
    </div>;
}

function CreateArticleLink(prop: {
    searchText: string
}) {
    let wikiContext = useContext(WikiContext);
    let createNewPageLink = wikiContext.config['fsg2CreateNewPageLink'];
    if (!createNewPageLink) return;
    let wgServer = wikiContext.config['wgServer'];
    let wgArticlePath = wikiContext.config['wgArticlePath'];
    let articleUrl = wgServer+wgArticlePath;
    articleUrl = articleUrl.replace(/\$1/g, prop.searchText) + createNewPageLink;
    return <div><a href={articleUrl}>Create an article: {prop.searchText}</a></div>

}

export default SearchBar;