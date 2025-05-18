import {Button} from "@mui/material";
import React, {useContext} from "react";
import {SearchStateFacet} from "../common/event_handler";
import {WikiContext} from "../index";

function RemoveAllFacetsButton(prop: {
    searchStateFacet: SearchStateFacet,
    onRemoveAllFacetsClick: () => void
}) {
    let wikiContext = useContext(WikiContext);

    if (!prop.searchStateFacet?.query.isAnyPropertySelected()
        && !prop.searchStateFacet?.query.isAnyCategorySelected()) {
        return;
    }
    return <div key={'removeAllFacets'}>
        <Button onClick={prop.onRemoveAllFacetsClick}
        >{wikiContext.msg('fs-remove-all-facets')}</Button>
    </div>
}

export default RemoveAllFacetsButton;