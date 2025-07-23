import React, {useContext, useEffect, useRef, useState} from "react";
import {WikiContext} from "../index";
import {Box, Button, TextField} from "@mui/material";
import EventHandler from "../common/event_handler";
import {useDebounce} from "../util/custom_hooks";
import CreateArticleLink from "./create_article";
import {BaseQuery} from "../common/datatypes";

function SearchBar(prop: {
    searchText: string
    eventHandler: EventHandler
    restoreFromQuery: boolean
    query: BaseQuery

}) {
    const wikiContext = useContext(WikiContext);
    const placeholderText = wikiContext.config['fs2gPlaceholderText'] ?? wikiContext.msg('fs-search-placeholder');

    const restoreFromQuery = useRef(prop.restoreFromQuery);
    const [searchText, setSearchText] = useState(prop.searchText);
    const debouncedSearchValue = useDebounce(searchText, 500);

    useEffect(() => {
        if (restoreFromQuery.current) {
            // required because facet query is not stored in the URL for length optimization reasons
            // in case that the q-param is used, facet values/ranges must be re-created once
            prop.eventHandler.onValuesClick(prop.query.propertyFacets);
            restoreFromQuery.current = false;
            return;
        }
        prop.eventHandler.onSearchClick(debouncedSearchValue);
    }, [debouncedSearchValue, restoreFromQuery]);

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