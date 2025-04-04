import {Datatype, Document, MWTitleWithURL, PropertyFacetValues} from "../common/datatypes";
import React, {ReactElement, useContext} from "react";
import {WikiContext} from "../index";
import WikiLink from "./wiki_link";
import DisplayTools from "../util/display_tools";
import Tools from "../util/tools";


function Annotations(prop: {doc: Document}) {
    let wikiContext = useContext(WikiContext);
    let annotationsInSnippets = wikiContext.config['fsgAnnotationsInSnippet'];

    for(let category in annotationsInSnippets) {
        let categoryFound = Tools.findFirst(prop.doc.categoryFacets, (c) => c.category, category) != null;
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

class ValueSerializer {

    static join(items: ReactElement[], delimiter: string = ', ') {
        return items.length > 0 ? items.reduce((prev, curr):any => [prev, delimiter, curr]):'';
    }

    static getValues(pfv: PropertyFacetValues): ReactElement {
        let items: ReactElement[] = [];

        if (pfv.property.type === Datatype.wikipage) {
            let mwTitles = pfv.values as MWTitleWithURL[];
            items = mwTitles.map((title: MWTitleWithURL) => <WikiLink page={title}/>);
        } else if (pfv.property.type === Datatype.datetime) {
            let values = pfv.values as Date[];
            items = values.map((date: Date) => <span>{DisplayTools.displayDate(date)}</span>);
        } else {
            let values = pfv.values as any[];
            items = values.map((value: any) => <span>{value}</span>);
        }
        return <span>{ValueSerializer.join(items)}</span>;

    }
}

export default Annotations;