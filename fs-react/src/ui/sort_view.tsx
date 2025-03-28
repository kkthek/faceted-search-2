import React, {useContext} from "react";
import {Datatype, Order, Property, Sort} from "../common/datatypes";
import {WikiContext} from "../index";

function SortView(prop : {
    sort: Sort,
    onChange: (sort: Sort) => void
}) {
    let wikiContext = useContext(WikiContext);

    let sorts = [];
    sorts.push(new Sort(new Property('score', Datatype.internal), Order.desc))
    sorts.push(new Sort(new Property('_MDAT', Datatype.datetime), Order.desc))
    sorts.push(new Sort(new Property('_MDAT', Datatype.datetime), Order.asc))
    sorts.push(new Sort(new Property('displaytitle', Datatype.internal), Order.desc))
    sorts.push(new Sort(new Property('displaytitle', Datatype.internal), Order.asc))

    let sortOptions = sorts.map((sort) => {
       let sortKey = sort.property.title + "_" + (sort.order === Order.desc ? 'desc' : 'asc');
       return <option key={sortKey}
                      value={JSON.stringify(sort)}
              >
           {wikiContext.msg(sortKey)}
       </option>
    });
    return <div><select value={JSON.stringify(prop.sort)}
                        onChange={(option) => prop.onChange(JSON.parse(option.target.value))}>
        {sortOptions}
    </select></div>
}

export default SortView;