import React, {useContext, useState} from "react";
import {WikiContext} from "../index";
import {Button, TextField} from "@mui/material";

function SearchBar(prop: {onClick: (text: string)=>void}) {
    let wikiContext = useContext(WikiContext);
    let placeholderText = wikiContext.config['fs2gPlaceholderText'];

    const [text, setText] = useState('');

    return <div id={'fs-searchbar'}>
        <TextField id="outlined-basic"
                   label={placeholderText}
                   size={'small'}
                   variant="outlined"
                   onKeyDown={(e) => { if (e.key === 'Enter') prop.onClick(text) } }
                   onChange={(e)=> setText(e.target.value)}
        />

        <Button variant="outlined" sx={{"margin-top": "2px"}} onClick={() => prop.onClick(text)}>Search</Button>
        <CreateArticleLink searchText={text}/>
    </div>;
}

function CreateArticleLink(prop: {
    searchText: string
}) {
    let wikiContext = useContext(WikiContext);
    let createNewPageLink = wikiContext.config['fs2gCreateNewPageLink'];
    if (!createNewPageLink) return;
    let wgServer = wikiContext.config['wgServer'];
    let wgArticlePath = wikiContext.config['wgArticlePath'];
    let articleUrl = wgServer+wgArticlePath;
    articleUrl = articleUrl.replace(/\$1/g, prop.searchText) + createNewPageLink;
    return <div><a href={articleUrl}>Create an article: {prop.searchText}</a></div>

}

export default SearchBar;