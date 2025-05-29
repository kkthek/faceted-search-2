import React, {Dispatch, SetStateAction, useContext} from "react";
import {WikiContext} from "../index";
import {Box, Button, TextField} from "@mui/material";
import EventHandler from "../common/event_handler";

function SearchBar(prop: {
    eventHandler: EventHandler,
    textState: [string, Dispatch<SetStateAction<string>>]
}) {
    let wikiContext = useContext(WikiContext);
    let placeholderText = wikiContext.config['fs2gPlaceholderText'];
    if (!placeholderText) {
        placeholderText = wikiContext.msg('fs-search-placeholder');
    }

    const [text, setText] = prop.textState;


    return <Box id={'fs-searchbar'} sx={{'display': 'flex'}}>
        <TextField id="fs-searchbar-button-text"
                   label={placeholderText}
                   size={'small'}
                   variant="outlined"
                   defaultValue={text}
                   onKeyDown={(e) => { if (e.key === 'Enter') prop.eventHandler.onSearchClick(text) } }
                   onChange={(e)=> setText(e.target.value)}
        />

        <Button id={'fs-searchbar-button'}
                size={'medium'}
                variant="outlined"
                onClick={() => prop.eventHandler.onSearchClick(text)}>{wikiContext.msg('fs-search-button')}</Button>
        </Box>;
}



export default SearchBar;