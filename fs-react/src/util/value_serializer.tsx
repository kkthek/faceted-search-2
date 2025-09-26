import React, {ReactElement} from "react";
import {Datatype, MWTitleWithURL, PropertyFacetValues} from "../common/datatypes";
import WikiLink from "../ui/wiki_link";
import DisplayTools from "./display_tools";
import Tools from "./tools";

class ValueSerializer {

    static join(items: ReactElement[], delimiter: string = ', ') {
        return items.length > 0 ? items.reduce((prev, curr):any => [prev, delimiter, curr]):'-';
    }

    static getValues(pfv: PropertyFacetValues): ReactElement {
        if (!pfv) return <span/>
        let items: ReactElement[] = [];

        if (pfv.property.type === Datatype.wikipage) {
            let mwTitles = pfv.values as MWTitleWithURL[];
            items = mwTitles.map((title: MWTitleWithURL) => <WikiLink key={title.title} page={title}/>);
        } else if (pfv.property.type === Datatype.datetime) {
            let values = pfv.values as Date[];
            items = values.map((date: Date) => <span key={Tools.secureUUIDV4()}>{DisplayTools.displayDate(date)}</span>);
        }  else if (pfv.property.type === Datatype.boolean) {
            let values = pfv.values as boolean[];
            items = values.map((b: boolean) => <span key={Tools.secureUUIDV4()}>{b ? "true":"false"}</span>);
        } else {
            let values = pfv.values as any[];
            items = values.map((value: any) => <span key={Tools.secureUUIDV4()}>{value}</span>);
        }
        return <span key={Tools.secureUUIDV4()}>{ValueSerializer.join(items)}</span>;

    }
}

export default ValueSerializer;
