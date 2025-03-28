import React from "react";
import {Property} from "../common/datatypes";

function FacetFilter(prop : {
    property: Property
    onFilterContainsClick: (text: string, property: Property) => void
}) {

    let text: string = '';
    return (prop.property.isRangeProperty() ? <div></div> : <div>
       <input type={'text'} size={30} onChange={(e)=> text = e.target.value}/>
        <button onClick={() => prop.onFilterContainsClick(text, prop.property)}>Filter</button>
    </div>)
}


export default FacetFilter;