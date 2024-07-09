/**
 * Faceted search 2
 *
 * (c) 2024 DIQA Projektmanagement GmbH
 *
 */
import {
    CategoryFacetCount,
    Datatype,
    Document,
    FacetQuery, FacetQueryResponse,
    NamespaceFacetCount,
    Property,
    PropertyFacetCount,
    PropertyFacetValues,
    PropertyValueCount, Range,
    SolrResponse,
    Stats,
    ValueCount
} from "../common/datatypes";
import Helper from "./helper";


class SolrResponseParser {

    private readonly body: any;
    private readonly RELATION_REGEX = /^smwh_(.*)_t$/;
    private readonly RELATION_FROM_FACET_REGEX = /^smwh_(.*)_s$/;
    private readonly ATTRIBUTE_REGEX = /smwh_(.*)_xsdvalue_(.*)/;

    constructor(body: object) {
        this.body = body;
    }

    parse(): SolrResponse {
        let docs: Document[] = [];
        this.body.response.docs.forEach((doc: any): any => {
            let propertyFacets: PropertyFacetValues[] = [];
            let categoryFacets: string[] = [];
            let directCategoryFacets: string[] = [];
            let namespace = null;
            let properties: Property[] = [];
            for (let property in doc) {
                if (property.startsWith("smwh_namespace_id")) {
                    namespace = doc[property];
                } else if (property.startsWith("smwh_categories")) {
                    categoryFacets = doc[property].map((category: string) => Helper.decodeWhitespacesInTitle(category));
                } else if (property.startsWith("smwh_directcategories")) {
                    directCategoryFacets = doc[property].map((category: string) => Helper.decodeWhitespacesInTitle(category));
                } else if (property.startsWith("smwh_attributes")) {
                    properties = properties.concat(this.parseProperties(doc[property]));
                } else if (property.startsWith("smwh_properties")) {
                    properties = properties.concat(this.parseProperties(doc[property]));
                } else if (property.startsWith("smwh_")) {
                    let item = this.parsePropertyWithValues(property, doc[property]);
                    if (item != null) {
                        propertyFacets.push(item);
                    }
                }
            }
            docs.push({
                id: doc.id,
                propertyFacets: propertyFacets,
                categoryFacets: categoryFacets,
                directCategoryFacets: directCategoryFacets,
                namespaceFacet: namespace,
                properties: properties,
                score: doc.score,
                title: doc.smwh_title,
                displayTitle: doc.smwh_displaytitle,
                highlighting: this.body.highlighting ? this.body.highlighting[doc.id].smwh_search_field : null
            });

        });
        let smwh_categories = this.body.facet_counts.facet_fields.smwh_categories;
        let categoryFacetCounts: CategoryFacetCount[] = [];
        for (let category in smwh_categories) {
            categoryFacetCounts.push({category: category, count: smwh_categories[category]});
        }
        let smwh_properties = this.body.facet_counts.facet_fields.smwh_properties;
        let propertyFacetCounts: PropertyFacetCount[] = [];
        for (let property in smwh_properties) {
            propertyFacetCounts.push({ property: this.parseProperty(property), count: smwh_properties[property]});
        }
        let smwh_namespaces = this.body.facet_counts.facet_fields.smwh_namespace_id;
        let namespaceFacetCounts: NamespaceFacetCount[] = [];
        for (let namespace in smwh_namespaces) {
            namespaceFacetCounts.push({ namespace: parseInt(namespace), count: smwh_namespaces[namespace]});
        }
        let propertyValueCount: PropertyValueCount[] = [];
        for (let p in this.body.facet_counts.facet_fields) {
            if (p === 'smwh_categories' || p === 'smwh_attributes' || p === 'smwh_properties' || p === 'smwh_namespace_id') continue;
            let property = this.parsePropertyFromFacet(p);
               let valueCounts: ValueCount[] = [];
               for(let v in this.body.facet_counts.facet_fields[p]) {
                   valueCounts.push({ value: v, count: this.body.facet_counts.facet_fields[p][v]});
               }
               propertyValueCount.push({property: property, values: valueCounts});
        }

        let stats: Stats[] = [];
        if ( this.body.stats && this.body.stats.stats_fields) {
            for(let p in this.body.stats.stats_fields) {
                let property = this.parsePropertyFromStats(p);
                if (property != null) {
                    let info = this.body.stats.stats_fields[p];
                    let stat: Stats = {
                        max: info.max,
                        min: info.min,
                        count: info.count,
                        sum: info.sum,
                        property: property
                    };
                    stats.push(stat);
                }
            }
        }

        let facetQueries: FacetQueryResponse[] = [];
        for (let key in this.body.facet_counts.facet_queries) {
            let propertyRange = key.split(':');
            let property = this.parsePropertyFromStats(propertyRange[0]);
            let range = propertyRange[1].match(/\[(.*) TO (.*)\]/);
            let r: Range;
            if (property.type == Datatype.datetime) {
                r = { from: Helper.parseDate(range[1]), to: Helper.parseDate(range[2])};
            } else if (property.type == Datatype.number) {
                r = { from: parseFloat(range[1]), to: parseFloat(range[2])};
            } else {
                continue;
            }

            let count = this.body.facet_counts.facet_queries[key];
            facetQueries.push({property: property, range: r, count: count})
        }

        return {
            propertyFacetCounts: propertyFacetCounts,
            namespaceFacetCounts: namespaceFacetCounts,
            categoryFacetCounts: categoryFacetCounts,
            numResults: this.body.response.numFound,
            propertyValueCount: propertyValueCount,
            docs : docs,
            stats: stats,
            facetQueries: facetQueries
        };
    }

    private parsePropertyWithValues(property: string, values: any): PropertyFacetValues {
        let nameType = property.match(this.ATTRIBUTE_REGEX);
        if (!nameType) {
            // maybe a relation facet
            nameType = property.match(this.RELATION_REGEX);
            if (nameType) {
                let name = nameType[1];
                 return this.parsePropertyValues(name, values);
            }
            return null;
        }
        let name = nameType[1];
        let type = nameType[2];
        return this.parseAttributeValues(name, values, type);

    }

    private parsePropertyValues(name: string, values: string[]): PropertyFacetValues {
        return {
            'property': { title: Helper.decodeWhitespacesInProperty(name), type: Datatype.wikipage },
            'values': values.map((e) => {
                let parts = e.split("|");
                return {title: parts[0], displayTitle: parts[1]};
            })
        };
    }

    private parseAttributeValues(name: string, values: any[], type: string): PropertyFacetValues {
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

    private parseProperties(docElement: any) {
        let properties: Property[] = [];
        docElement.forEach((property: string) => {
            properties.push(this.parseProperty(property));
        });
        return properties;
    }

    private parseProperty(property: string): Property {
        let nameType = property.match(this.ATTRIBUTE_REGEX);
        if (!nameType) {
            nameType = property.match(this.RELATION_REGEX);
            if (nameType) {
                let name = nameType[1];
                name = Helper.decodeWhitespacesInProperty(name);
                 return { title: name, type: Datatype.wikipage};
            }
        }
        let name = nameType[1];
        let type = nameType[2];
        name = Helper.decodeWhitespacesInProperty(name);
        let datatype: Datatype;
        switch(type) {
            case 'd':
            case 'i':
                datatype = Datatype.number;
                break;
            case 'b':
                datatype = Datatype.boolean;
                break;
            case 'dt':
                datatype = Datatype.datetime;
                break;
            case 's':
            default:
                datatype = Datatype.string;
        }
        return { title: name, type: datatype};
    }

    private parsePropertyFromFacet(property: string): Property {
        let nameType = property.match(this.ATTRIBUTE_REGEX);
        if (!nameType) {
            nameType = property.match(this.RELATION_FROM_FACET_REGEX);
            if (nameType) {
                let name = nameType[1];
                name = Helper.decodeWhitespacesInProperty(name);
                return { title: name, type: Datatype.wikipage};
            }
        }
        let name = nameType[1];
        let type = nameType[2];
        name = Helper.decodeWhitespacesInProperty(name);
        let datatype: Datatype;
        switch(type) {
            case 'd':
            case 'i':
                datatype = Datatype.number;
                break;
            case 'b':
                datatype = Datatype.boolean;
                break;
            case 'dt':
                datatype = Datatype.datetime;
                break;
            case 's':
            default:
                datatype = Datatype.string;
        }
        return { title: name, type: datatype};
    }

    private parsePropertyFromStats(property: string): Property {
        let name = property.match(/smwh_(.*)_datevalue_l/);
        if (!name) {
            name = property.match(/smwh_(.*)_xsdvalue_d/);
            return { title: Helper.decodeWhitespacesInProperty(name[1]), type: Datatype.datetime};
            if (!name) {
                return null;
            }
        }
        return { title: Helper.decodeWhitespacesInProperty(name[1]), type: Datatype.number};
    }

}

export default SolrResponseParser;