import React, {ReactElement} from "react";
import {Datatype, MWTitleWithURL, PropertyFacetValues} from "../common/datatypes";
import WikiLink from "../ui/common/wiki_link";
import DisplayTools from "./display_tools";
import Tools from "./tools";
import Span, {Span2} from "../custom_ui/span";

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
            items = values.map((date: Date) => <Span2 key={Tools.secureUUIDV4()}>{DisplayTools.displayDate(date)}</Span2>);
        }  else if (pfv.property.type === Datatype.boolean) {
            let values = pfv.values as boolean[];
            items = values.map((b: boolean) => <Span2 key={Tools.secureUUIDV4()}>{b ? "true":"false"}</Span2>);
        } else {
            let values = pfv.values as any[];
            items = values.map((value: any) => <Span2 dangerouslySetInnerHTML={{__html: value}}  key={Tools.secureUUIDV4()}></Span2>);
        }
        return <React.Fragment key={Tools.secureUUIDV4()}>{ValueSerializer.join(items)}</React.Fragment>;

    }
}

export default ValueSerializer;
