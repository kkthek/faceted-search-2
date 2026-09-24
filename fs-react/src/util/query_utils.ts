import {BaseQuery} from "app/common/request/base_query";
import {Property} from "app/common/property";
import {FacetsQuery} from "app/common/request/facets_query";
import FacetQueryBuilder from "app/common/query_builders/facet_query_builder";
import {PropertyValueQuery} from "app/common/request/property_value_query";
import {WikiContextAccessor} from "app/common/wiki_context";
import {Datatype} from "app/common/datatypes";

class QueryUtils {

    static prepareValueQueryWithoutFacet(query: BaseQuery, property: Property): FacetsQuery {

        return new FacetQueryBuilder()
            .updateBaseQuery(query)
            .withoutPropertyFacet(property)
            .withPropertyValueQuery(new PropertyValueQuery(property))
            .build();

    }

    static prepareRangeQueryWithoutFacet(query: BaseQuery, property: Property): FacetsQuery {

        return new FacetQueryBuilder()
            .updateBaseQuery(query)
            .withoutPropertyFacet(property)
            .withRangeQuery(property)
            .build();

    }

    static prepareTagCloudValueQuery(wikiContext: WikiContextAccessor): PropertyValueQuery {
        const tagCloudProperty = wikiContext.config.fs2gTagCloudProperty;
        const facetValueLimit = wikiContext.config.fs2gFacetValueLimit;
        if (tagCloudProperty === false || tagCloudProperty === '') {
            return;
        }
        return PropertyValueQuery.forAllValues(new Property(tagCloudProperty, Datatype.string), facetValueLimit);
    }
}

export default QueryUtils;