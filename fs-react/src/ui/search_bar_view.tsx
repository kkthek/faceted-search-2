import React, {useContext, useEffect, useRef, useState} from "react";
import {WikiContext} from "../index";
import {Box, Button, TextField} from "@mui/material";
import EventHandler from "../common/event_handler";
import {useDebounce} from "../util/custom_hooks";
import CreateArticleLink from "./create_article";

function SearchBar(prop: {
    searchText: string
    eventHandler: EventHandler
    firstRenderRequired: boolean

}) {
    let wikiContext = useContext(WikiContext);
    let placeholderText = wikiContext.config['fs2gPlaceholderText'];
    if (!placeholderText) {
        placeholderText = wikiContext.msg('fs-search-placeholder');
    }

    const firstRenderRequired = useRef(prop.firstRenderRequired);
    const [searchText, setSearchText] = useState(prop.searchText);
    const debouncedSearchValue = useDebounce(searchText, 500);
    useEffect(() => {
        if (!firstRenderRequired.current) {
            firstRenderRequired.current = true;
            return;
        }
        prop.eventHandler.onSearchClick(debouncedSearchValue);
    }, [debouncedSearchValue, firstRenderRequired]);

    return <Box id={'fs-searchbar'} sx={{'display': 'flex'}}>
        <TextField id="fs-searchbar-button-text"
                   label={placeholderText}
                   size={'small'}
                   variant="outlined"
                   value={searchText}
                   onKeyDown={(e) => { if (e.key === 'Enter') { prop.eventHandler.onSearchClick(searchText); } } }
                   onChange={(e)=> setSearchText(e.target.value)}
        />

        <Button id={'fs-searchbar-button'}
                size={'medium'}
                variant="outlined"
                onClick={() => prop.eventHandler.onSearchClick(searchText)}>{wikiContext.msg('fs-search-button')}</Button>
        <CreateArticleLink key={'createArticleLink'} searchText={searchText}/>
        </Box>;
}



export default SearchBar;