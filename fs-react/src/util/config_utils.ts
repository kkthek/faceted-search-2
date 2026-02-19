import {Datatype, Order, Sortable, ValueType} from "../common/datatypes";
import {WikiContextAccessor} from "../common/wiki_context";
import {Property} from "../common/property";
import {MWTitle} from "../common/mw_title";
import {Sort} from "../common/request/sort";
import {Document} from "../common/response/document";

class ConfigUtils {

    static getSortFunction<T extends Sortable<T>>(sortType: string): (a: T, b: T) => number {
        switch (sortType) {
            case 'sort-by-count':
                return (a: T, b: T) => a.compareByCount(b);
            default:
            case 'sort-alphabetically':
                return (a: T, b: T) => a.compareAlphabetically(b);
        }
    }

    static getFileExtension(url: string) {
        let u = (URL as any).parse(url);
        if (u === null) return '';
        return u['pathname'].toLowerCase().split('.').pop();
    }

    static getFileType(ext: string) {
        switch (ext) {
            case 'pdf': return "application/pdf";
            case 'png': return "image/png";
            case 'jpeg':
            case 'jpg': return "image/jpeg";
            default:
                return 'application/text';
        }
    }

    static getAllSorts(): Sort[] {
        return [
            new Sort('score', new Property('score', Datatype.internal), Order.desc),
            new Sort('newest', new Property('_MDAT', Datatype.datetime), Order.desc),
            new Sort('oldest', new Property('_MDAT', Datatype.datetime), Order.asc),
            new Sort('ascending', new Property('displaytitle', Datatype.internal), Order.asc),
            new Sort('descending', new Property('displaytitle', Datatype.internal), Order.desc)
        ];
    }

    static getSortByKeyOrDefault(key: string): Sort {
        const allSorts = ConfigUtils.getAllSorts();
        return allSorts.findFirst(sort => sort.getKey() === key) ?? allSorts[0];
    }


    static getFileResourceURL(doc: Document) {
        let previewUrlPropertyValues = doc.getPropertyFacetValues("Diqa import fullpath")
        if (previewUrlPropertyValues.values.length === 0) {
            const oldPreviewUrlPropertyValues = doc.getPropertyFacetValues("diqa_import_fullpath"); // fallback
            previewUrlPropertyValues = oldPreviewUrlPropertyValues ?? previewUrlPropertyValues;
        }
        return previewUrlPropertyValues?.values[0] as string;
    }

    static replaceSMWVariables(doc: Document, url: string) {

        const smwVariables = url.matchAll(/\{SMW:([^}]+)}/gi);

        // @ts-ignore
        for (let smwVariable of smwVariables) {
            const propertyName = smwVariable[1];
            const pfv = doc.getPropertyFacetValues(propertyName);
            if (pfv === null) continue;

            const value = pfv.values.map((value: ValueType | MWTitle) => {
                const mwTitle = value as MWTitle;
                return mwTitle ? mwTitle.title : value.toString();
            }).join(',');
            url = url.replace(`{SMW:${propertyName}}`, encodeURIComponent(value));
        }

        return url;
    }

    static replaceMagicWords(doc: Document, url: string, wikiContext: WikiContextAccessor) {
        let s = url;
        s = s.replace('{CURRENTUSER}', encodeURIComponent(wikiContext.username));
        s = s.replace('{PAGENAME}', encodeURIComponent(doc.title));
        s = s.replace('{NAMESPACEINDEX}', encodeURIComponent(doc.namespaceFacet.namespace.toString()));

        const namespaces = wikiContext.config['wgFormattedNamespaces'];
        const namespaceAsText = namespaces[doc.namespaceFacet.namespace];
        const fullTitle = doc.namespaceFacet.namespace !== 0 ? namespaceAsText+':'+doc.title : doc.title;
        s = s.replace('{FULLPAGENAME}', encodeURIComponent(fullTitle));
        return s;
    }

}

export default ConfigUtils;