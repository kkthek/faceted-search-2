/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import {AttributeFacetResponse, PropertyFacetResponse, SolrResponse} from "./datatypes";
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
        let attributeFacets: AttributeFacetResponse[] = [];
        let propertyFacets: PropertyFacetResponse[] = [];
        this.body.response.docs.forEach((e: any): any => {
            for (let p in e) {

                if (p.startsWith("smwh_")) {
                    let nameType = p.match(this.ATTRIBUTE_REGEX);
                    if (!nameType) {
                        // maybe a relation facet
                        nameType = p.match(this.RELATION_REGEX);
                        if (nameType) {
                            let name = nameType[1];
                            propertyFacets.push(this.parseProperty(name, e[p]));
                        }
                        continue;
                    }
                    let name = nameType[1];
                    let type = nameType[2];
                    attributeFacets.push(this.parseAttribute(name, e[p], type));
                }
            }
        });
        return {
            numResults: this.body.response.numFound,
            attributeFacets: attributeFacets,
            propertyFacets: propertyFacets,
            categoryFacets: [],
            namespaceFacets: []
        };
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