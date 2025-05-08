import {BaseQuery, FacetsQuery, Property, PropertyValueConstraint} from "../common/datatypes";
import FacetQueryBuilder from "../common/facet_query_builder";

class QueryUtils {

    static prepareQueryWithoutFacet(query: BaseQuery, property: Property): FacetsQuery {

        return new FacetQueryBuilder()
            .updateBaseQuery(query)
            .withoutPropertyFacet(property)
            .withPropertyValueConstraint(new PropertyValueConstraint(property))
            .build();

    }
}

export default QueryUtils;