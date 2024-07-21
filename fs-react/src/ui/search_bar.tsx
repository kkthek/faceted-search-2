import React from "react";

function SearchBar(prop: {onClick: (text: string)=>void}) {

    let text: string = '';
    return <div id={'fs-searchbar'}>
        <input type={'text'} id={'fs-fulltext'} onChange={(e)=> text = e.target.value}></input>
        <button id={'fs-fulltext-button'} onClick={() => prop.onClick(text)}>Search</button>
    </div>;
}

export default SearchBar;