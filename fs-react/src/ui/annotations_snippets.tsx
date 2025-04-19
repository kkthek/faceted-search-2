import {Document} from "../common/datatypes";
import React, {useContext} from "react";
import {WikiContext} from "../index";
import WikiLink from "./wiki_link";
import ValueSerializer from "../util/value_serializer";


function Annotations(prop: {doc: Document}) {
    let wikiContext = useContext(WikiContext);
    let annotationsInSnippets = wikiContext.config['fs2gAnnotationsInSnippet'];

    for(let category in annotationsInSnippets) {
        let categoryFound = prop.doc.getCategoryFacetValue(category) != null;
        if (!categoryFound) continue;
        let rows = annotationsInSnippets[category].map((property: string) => {
            let propertyFacetValues = prop.doc.getPropertyFacetValues(property);

            return  <div key={'annotation-'+prop.doc.id+'-'+property}>
                        <span><WikiLink page={propertyFacetValues.property}/>: </span>
                        <span>{ValueSerializer.getValues(propertyFacetValues)}</span>
                    </div>
        });
        return <div>{rows}</div>;

    }
    return <div></div>;

}


export default Annotations;