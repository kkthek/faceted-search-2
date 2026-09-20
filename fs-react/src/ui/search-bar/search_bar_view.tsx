import React, {KeyboardEvent, useContext, useEffect, useState} from "react";
import {Box, Button, TextField} from "@mui/material";
import EventHandler from "app/common/event_handler";
import {DocumentQuery} from "app/common/request/document_query";
import {TYPING_DELAY, WikiContext} from "app/index";
import {useDebounce} from "app/custom_ui/custom_hooks";

function SearchBar(prop: {
    eventHandler: EventHandler
    restoreFromQuery: boolean
    query: DocumentQuery

}) {
    const wikiContext = useContext(WikiContext);
    const placeholderText = wikiContext.config['fs2gPlaceholderText'] ?? wikiContext.msg('fs-search-placeholder');

    const [searchText, setSearchText] = useState(prop.query.searchText ?? '');
    const debouncedSearchText = useDebounce(searchText, TYPING_DELAY);

    useEffect(() => {
         prop.eventHandler.onSearchClick(debouncedSearchText);
    }, [debouncedSearchText]);

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            prop.eventHandler.onSearchClick(searchText);
        } else if (e.key === 'Escape') {
            setSearchText('');
        }
    };

    return <Box id={'fs-searchbar'}>
        <TextField id="fs-searchbar-button-text"
                   placeholder={placeholderText}
                   size={'small'}
                   variant="outlined"
                   value={searchText}
                   onKeyDown={onKeyDown}
                   fullWidth={true}
                   onChange={(e) => setSearchText(e.target.value)}
        />

        <Button id={'fs-searchbar-button'}
                size={'medium'}
                variant="outlined"
                onClick={() => prop.eventHandler.onSearchClick(searchText)}>
            {wikiContext.msg('fs-search-button')}
        </Button>
    </Box>;
}


export default SearchBar;