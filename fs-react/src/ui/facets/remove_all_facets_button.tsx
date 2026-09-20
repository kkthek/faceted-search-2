import {Button} from "@mui/material";
import React, {useContext} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {BaseQuery} from "app/common/request/base_query";
import EventHandler from "app/common/event_handler";
import {WikiContext} from "app/index";

function RemoveAllFacetsButton(prop: {
    query: BaseQuery,
    eventHandler: EventHandler
}) {
    const wikiContext = useContext(WikiContext);

    if (!prop.query.isAnyFacetSelected()) {
        return;
    }
    return <>
        <Button onClick={prop.eventHandler.onRemoveAllFacetsClick}>
            <DeleteIcon titleAccess={wikiContext.msg('fs-remove-all-facets')}/>
        </Button>
    </>
}

export default RemoveAllFacetsButton;