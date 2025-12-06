import React, {ReactElement, useContext} from "react";
import {Datatype, MWTitleWithURL, PropertyFacetValues} from "../common/datatypes";
import WikiLink from "../ui/common/wiki_link";
import DisplayTools from "./display_tools";
import Tools from "./tools";
import Span from "../custom_ui/span";
import {WikiContext} from "../index";

class ValueSerializer {

    static join(items: ReactElement[], delimiter: string = ', ') {
        return items.length > 0 ? items.reduce((prev, curr): any => [prev, delimiter, curr]) : '-';
    }

    static getValues(pfv: PropertyFacetValues, itemPrefix = ''): ReactElement {
        const wikiContext = useContext(WikiContext);
        if (!pfv) return <span/>
        let items: ReactElement[] = [];

        if (pfv.property.type === Datatype.wikipage) {
            const mwTitles = pfv.values as MWTitleWithURL[];
            items = mwTitles.map((title: MWTitleWithURL) => <WikiLink key={title.title} page={title}/>);
        } else if (pfv.property.type === Datatype.datetime) {
            const values = pfv.values as Date[];
            items = values.map((date: Date) => {
                const displayDate = DisplayTools.displayDate(date);
                const key = itemPrefix + Tools.createItemIdForValue(pfv.property, displayDate.toString());
                return <Span color={"secondary"} key={key}>{displayDate}</Span>;
            });
        } else if (pfv.property.type === Datatype.boolean) {
            const values = pfv.values as boolean[];
            items = values.map((b: boolean) => {
                const localeBool = wikiContext.msg("fs-bool-value-" + b.toString());
                const key = itemPrefix + Tools.createItemIdForValue(pfv.property, localeBool);
                return <Span color={"secondary"} key={key}>{localeBool}</Span>;
            });
        } else {
            const values = pfv.values as any[];
            items = values.map((value: any) => {
                const key = itemPrefix + Tools.createItemIdForValue(pfv.property, value.toString());
                return <Span color={"secondary"}
                             dangerouslySetInnerHTML={{__html: value}}
                             key={key}/>;
            });
        }
        return <React.Fragment>{ValueSerializer.join(items)}</React.Fragment>;

    }
}

export default ValueSerializer;
