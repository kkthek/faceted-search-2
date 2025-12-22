import FacetQueryBuilder from "../common/query_builders/facet_query_builder";
import {Property} from "../common/property";
import {PropertyValueQuery} from "../common/request/property_value_query";
import {BaseQuery} from "../common/request/base_query";
import {FacetsQuery} from "../common/request/facets_query";

class QueryUtils {

    static prepareQueryWithoutFacet(query: BaseQuery, property: Property): FacetsQuery {

        return new FacetQueryBuilder()
            .updateBaseQuery(query)
            .withoutPropertyFacet(property)
            .withPropertyValueQuery(new PropertyValueQuery(property))
            .build();

    }
}

export default QueryUtils;