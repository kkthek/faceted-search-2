import React, {useContext} from "react";
import {WikiContext} from "../index";

function SearchBar(prop: {onClick: (text: string)=>void}) {
    let wikiContext = useContext(WikiContext);
    let placeholderText = wikiContext.config['fsg2PlaceholderText'];

    let text: string = '';
    return <div id={'fs-searchbar'}>
        <input type={'text'} id={'fs-fulltext'}
               onChange={(e)=> text = e.target.value}
               placeholder={placeholderText}
        />

        <button id={'fs-fulltext-button'} onClick={() => prop.onClick(text)}>Search</button>
    </div>;
}

export default SearchBar;