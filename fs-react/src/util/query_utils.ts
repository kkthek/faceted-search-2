import {BaseQuery, FacetsQuery, Property, PropertyValueQuery} from "../common/datatypes";
import FacetQueryBuilder from "../common/facet_query_builder";

class QueryUtils {

    static prepareQueryWithoutFacet(query: BaseQuery, property: Property): FacetsQuery {

        return new FacetQueryBuilder()
            .updateBaseQuery(query)
            .withoutPropertyFacet(property)
            .withPropertyValueConstraint(new PropertyValueQuery(property))
            .build();

    }
}

export default QueryUtils;