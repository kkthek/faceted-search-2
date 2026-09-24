import React, {ReactElement, useContext} from "react";
import {PropertyFacetValues} from "app/common/response/property_facet_values";
import {Datatype} from "app/common/datatypes";
import IdTools from "app/util/id_tools";
import Span from "app/custom_ui/span";
import {WikiContext} from "app/index";
import DateTools from "app/util/date_tools";
import {MWTitleWithURL} from "app/common/response/mw_title_with_URL";
import WikiLink from "app/ui/common/wiki_link";

class ValueSerializer {

    static join(items: ReactElement[], delimiter: string = ', ') {
        return items.length > 0 ? items.reduce((prev, curr): any => [prev, delimiter, curr]) : '-';
    }

    static getValues(pfv: PropertyFacetValues, itemPrefix = ''): ReactElement {

        if (!pfv) return;
        let items: ReactElement[];

        switch(pfv.property.type) {
            case Datatype.boolean:
                items = this.serializeBoolean(pfv, itemPrefix);
                break;
            case Datatype.datetime:
                items = this.serializeDatetime(pfv, itemPrefix);
                break;
            case Datatype.wikipage:
                items = this.serializeWikiPage(pfv, itemPrefix);
                break;
            case Datatype.string:
            case Datatype.number:
            default:
                items = this.serializeAny(pfv, itemPrefix);
        }

        return <>{ValueSerializer.join(items)}</>;

    }

    private static serializeAny(pfv: PropertyFacetValues, itemPrefix: string) {
        const values = pfv.values as any[];
        return values.map((value: any) => {
            const key = itemPrefix + IdTools.createItemIdForValue(pfv.property, value.toString());
            return <Span color={"secondary"}
                         dangerouslySetInnerHTML={{__html: value}}
                         key={key}/>;
        });
    }

    private static serializeBoolean(pfv: PropertyFacetValues, itemPrefix: string) {
        const wikiContext = useContext(WikiContext);
        const values = pfv.values as boolean[];
        return values.map((b: boolean) => {
            const localeBool = wikiContext.msg("fs-bool-value-" + b.toString());
            const key = itemPrefix + IdTools.createItemIdForValue(pfv.property, localeBool);
            return <Span color={"secondary"} key={key}>{localeBool}</Span>;
        });
    }

    private static serializeDatetime(pfv: PropertyFacetValues, itemPrefix: string) {
        const values = pfv.values as Date[];
        const wikiContext = useContext(WikiContext);
        return values.map((date: Date) => {
            const displayDate = DateTools.displayDate(date, wikiContext.getLocale());
            const key = itemPrefix + IdTools.createItemIdForValue(pfv.property, displayDate.toString());
            return <Span color={"secondary"} key={key}>{displayDate}</Span>;
        });
    }

    private static serializeWikiPage(pfv: PropertyFacetValues, itemPrefix: string) {
        const mwTitles = pfv.values as MWTitleWithURL[];

        return mwTitles.map((title: MWTitleWithURL) => {
            const key = itemPrefix + IdTools.createItemIdForValue(pfv.property, title.title);
            return <WikiLink key={key} page={title}/> });
    }
}

export default ValueSerializer;
