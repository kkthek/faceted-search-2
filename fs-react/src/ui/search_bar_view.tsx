import React, {useContext, useState} from "react";
import {WikiContext} from "../index";
import {Button, TextField} from "@mui/material";

function SearchBar(prop: {onClick: (text: string)=>void}) {
    let wikiContext = useContext(WikiContext);
    let placeholderText = wikiContext.config['fs2gPlaceholderText'];
    if (!placeholderText) {
        placeholderText = wikiContext.msg('fs-search-placeholder');
    }
    const [text, setText] = useState('');

    return <div id={'fs-searchbar'}>
        <TextField id="outlined-basic"
                   label={placeholderText}
                   size={'small'}
                   variant="outlined"
                   sx={{"marginLeft": "10px", "width": "75%"}}
                   onKeyDown={(e) => { if (e.key === 'Enter') prop.onClick(text) } }
                   onChange={(e)=> setText(e.target.value)}
        />

        <Button size={'medium'}
                variant="outlined"
                sx={{"marginTop": "2px", "marginLeft": "10px"}}
                onClick={() => prop.onClick(text)}>{wikiContext.msg('fs-search-button')}</Button>
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