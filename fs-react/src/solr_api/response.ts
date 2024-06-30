/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import {Datatype, Document, PropertyFacetResponse, SolrResponse} from "../common/datatypes";
import Helper from "./helper";


class SolrResponseParser {

    private readonly body: any;
    private readonly RELATION_REGEX = /^smwh_(.*)_t$/;
    private readonly ATTRIBUTE_REGEX = /smwh_(.*)_xsdvalue_(.*)/;

    constructor(body: object) {
        this.body = body;
    }

    parse(): SolrResponse {
        let docs: Document[] = [];
        this.body.response.docs.forEach((doc: any): any => {
            let propertyFacets: PropertyFacetResponse[] = [];
            let categoryFacets: string[] = [];
            let directCategoryFacets: string[] = [];
            let namespace = null;
            for (let property in doc) {
                if (property.startsWith("smwh_namespace_id")) {
                    namespace = doc[property];
                } else if (property.startsWith("smwh_categories")) {
                    categoryFacets = doc[property];
                } else if (property.startsWith("smwh_directcategories")) {
                    directCategoryFacets = doc[property];
                } else if (property.startsWith("smwh_")) {
                    this.parseAttributeOrProperty(property, doc[property], propertyFacets);
                }
            }
            docs.push({
                propertyFacets: propertyFacets,
                categoryFacets: categoryFacets,
                directCategoryFacets: directCategoryFacets,
                namespaceFacet: namespace
            })
        });
        return {
            numResults: this.body.response.numFound,
            docs : docs
        };
    }

    private parseAttributeOrProperty(property: string, values: any, propertyFacets: PropertyFacetResponse[]) {
        let nameType = property.match(this.ATTRIBUTE_REGEX);
        if (!nameType) {
            // maybe a relation facet
            nameType = property.match(this.RELATION_REGEX);
            if (nameType) {
                let name = nameType[1];
                propertyFacets.push(this.parseProperty(name, values));
            }
            return;
        }
        let name = nameType[1];
        let type = nameType[2];
        propertyFacets.push(this.parseAttribute(name, values, type));
    }

    private parseProperty(name: string, values: string[]): PropertyFacetResponse {
        return {
            'property': { title: Helper.decodeWhitespacesInProperty(name), type: Datatype.wikipage },
            'values': values.map((e) => {
                let parts = e.split("|");
                return {title: parts[0], displayTitle: parts[1]};
            })
        };
    }

    private parseAttribute(name: string, values: any[], type: string): PropertyFacetResponse {
        let decodedPropertyName = Helper.decodeWhitespacesInProperty(name);
        switch (type) {
            case 'd':
            case 'i':
                // numeric
                return {
                    property: {title: decodedPropertyName, type: Datatype.number },
                    values: values.map((e) => parseFloat(e))
                };
            case 'dt':
                // date
                return {
                    property: {title: decodedPropertyName, type: Datatype.datetime },
                    values: values.map((e) => {
                        return Date.parse(e);
                    })
                };
            case 'b':
                // boolean
                return {
                    property: {title: decodedPropertyName, type: Datatype.boolean },
                    values: values.map((e) => {
                        console.log(values);
                        if (typeof e === 'boolean') {
                            return e;
                        }
                        return typeof e === 'string' && e.trim().toLowerCase() === 'true';
                    })
                };
            case 's':
                // string or anything else
            default:
                return {
                    property: {title: decodedPropertyName, type: Datatype.string },
                    values: values
                };
        }

    }
}

export default SolrResponseParser;