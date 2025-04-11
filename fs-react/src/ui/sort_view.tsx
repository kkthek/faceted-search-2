import React, {useContext} from "react";
import {Datatype, Order, Property, Sort} from "../common/datatypes";
import {WikiContext} from "../index";

function SortView(prop : {
    sort: Sort,
    onChange: (sort: Sort) => void
}) {
    let wikiContext = useContext(WikiContext);
    let defaultSortOrder = wikiContext.config['fsg2DefaultSortOrder'];
    let showSortView = wikiContext.config['fsg2ShowSortOrder'];
    if (!showSortView) return;

    let sorts = [
        getSortByName('score'),
        getSortByName('newest'),
        getSortByName('oldest'),
        getSortByName('ascending'),
        getSortByName('descending')
    ];

    let sortOptions = sorts.map((sort) => {
       let sortKey = sort.property.title + "_" + (sort.order === Order.desc ? 'desc' : 'asc');
       return <option key={sortKey} value={JSON.stringify(sort)}>{wikiContext.msg(sortKey)}</option>
    });
    return <div><select defaultValue={JSON.stringify(getSortByName(defaultSortOrder))}
                        onChange={(option) => prop.onChange(JSON.parse(option.target.value))}>
        {sortOptions}
    </select></div>
}

let getSortByName = function(name: string): Sort {
    switch(name) {
        case 'newest': return new Sort(new Property('_MDAT', Datatype.datetime), Order.desc);
        case 'oldest': return new Sort(new Property('_MDAT', Datatype.datetime), Order.asc);
        case 'ascending': return new Sort(new Property('displaytitle', Datatype.internal), Order.asc);
        case 'descending': return new Sort(new Property('displaytitle', Datatype.internal), Order.desc);
        default:
        case 'score': return new Sort(new Property('score', Datatype.internal), Order.desc);
    }
}

export default SortView;