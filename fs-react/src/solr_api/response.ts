/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import {AttributeFacetResponse, Documents, PropertyFacetResponse, SolrResponse} from "./datatypes";
import {Datatype} from "./datatypes";
import Helper from "./helper";


class SolrResponseParser {

    private readonly body: any;
    private readonly RELATION_REGEX = /^smwh_(.*)_t$/;
    private readonly ATTRIBUTE_REGEX = /smwh_(.*)_xsdvalue_(.*)/;

    constructor(body: object) {
        this.body = body;
    }

    parse(): SolrResponse {
        let docs: Documents[] = [];
        this.body.response.docs.forEach((doc: any): any => {
            let attributeFacets: AttributeFacetResponse[] = [];
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
                    this.parseAttributeOrProperty(property, doc[property], propertyFacets, attributeFacets);
                }
            }
            docs.push({
                attributeFacets: attributeFacets,
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

    private parseAttributeOrProperty(property: string, values: any, propertyFacets: PropertyFacetResponse[], attributeFacets: AttributeFacetResponse[]) {
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
        attributeFacets.push(this.parseAttribute(name, values, type));
    }

    private parseProperty(name: string, value: string[]): PropertyFacetResponse {
        return {
            'property': Helper.decodeWhitespacesInProperty(name),
            'value': value.map((e) => {
                let parts = e.split("|");
                return {title: parts[0], displayTitle: parts[1]};
            })
        };
    }

    private parseAttribute(name: string, value: string[], type: string): AttributeFacetResponse {
        let decodedPropertyName = Helper.decodeWhitespacesInProperty(name);
        switch (type) {
            case 'd':
            case 'i':
                // numeric
                return {
                    'property': decodedPropertyName,
                    'value': value.map((e) => parseFloat(e)),
                    'type': Datatype.number
                };
            case 'dt':
                // date
                return {
                    'property': decodedPropertyName,
                    'value': value.map((e) => {
                        return Date.parse(e);
                    }),
                    'type': Datatype.datetime
                };
            case 'b':
                return {
                    'property': decodedPropertyName,
                    'value': value,
                    'type': Datatype.boolean
                };
            case 's':
            default:
                return {
                    'property': decodedPropertyName,
                    'value': value,
                    'type': Datatype.string
                };
        }

    }
}

export default SolrResponseParser;