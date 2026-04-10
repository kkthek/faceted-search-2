import {Button} from "@mui/material";
import React, {useContext} from "react";
import EventHandler from "../../common/event_handler";
import {WikiContext} from "../../index";
import {BaseQuery} from "../../common/request/base_query";
import DeleteIcon from "@mui/icons-material/Delete";

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