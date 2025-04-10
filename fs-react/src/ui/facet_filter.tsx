import React, {useContext, useState} from "react";
import {Property} from "../common/datatypes";
import {WikiContext} from "../index";

function FacetFilter(prop : {
    property: Property
    numberOfValues: number
    onFilterContainsClick: (text: string, limit: number, property: Property) => void
}) {

    let wikiContext = useContext(WikiContext);

    let needsNoFilter = prop.numberOfValues < wikiContext.config.fsg2FacetValueLimit;
    let unsuitableProperty = prop.property.isRangeProperty() || prop.property.isBooleanProperty();
    const [text, setText] = useState((): string => '');
    const [unchanged, setUnchanged] = useState((): boolean => true);

    if (unsuitableProperty || (unchanged && needsNoFilter)) {
        return <div/>
    }

    return <div>
       <input type={'text'} value={text} size={30} onChange={(e)=> {
           setText(e.target.value);
           setUnchanged(false);
       }}/>
        <button onClick={() => prop.onFilterContainsClick(text, wikiContext.config.fsg2FacetValueLimit, prop.property)}>Filter</button>
    </div>
}


export default FacetFilter;