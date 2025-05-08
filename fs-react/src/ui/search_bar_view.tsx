import React, {Dispatch, SetStateAction, useContext} from "react";
import {WikiContext} from "../index";
import {Button, TextField} from "@mui/material";

function SearchBar(prop: {
    onClick: (text: string)=>void
    textState: [string, Dispatch<SetStateAction<string>>]
}) {
    let wikiContext = useContext(WikiContext);
    let placeholderText = wikiContext.config['fs2gPlaceholderText'];
    if (!placeholderText) {
        placeholderText = wikiContext.msg('fs-search-placeholder');
    }

    const [text, setText] = prop.textState;


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

    </div>;
}



export default SearchBar;