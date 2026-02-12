import FacetQueryBuilder from "../common/query_builders/facet_query_builder";
import {Property} from "../common/property";
import {PropertyValueQuery} from "../common/request/property_value_query";
import {BaseQuery} from "../common/request/base_query";
import {FacetsQuery} from "../common/request/facets_query";
import {WikiContextAccessor} from "../common/wiki_context";
import {Datatype} from "../common/datatypes";

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

    static setTagCloudValueQuery(wikiContext: WikiContextAccessor, currentFacetsQueryBuilder: FacetQueryBuilder) {
        if (wikiContext.config.fs2gTagCloudProperty === '') {
            return;
        }
        currentFacetsQueryBuilder.withPropertyValueQuery(PropertyValueQuery.forAllValues(
            new Property(wikiContext.config.fs2gTagCloudProperty, Datatype.string),
            wikiContext.config.fs2gFacetValueLimit
        ));
    }
}

export default QueryUtils;