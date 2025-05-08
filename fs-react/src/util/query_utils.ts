import {BaseQuery, FacetsQuery, Property, PropertyValueConstraint} from "../common/datatypes";
import FacetQueryBuilder from "../common/facet_query_builder";

class QueryUtils {
    static prepareQueryWithoutFacet(query: BaseQuery, property: Property): FacetsQuery {
        let queryBuilder = new FacetQueryBuilder();
        queryBuilder.updateBaseQueryDirect(query);
        queryBuilder.withoutPropertyFacet(property);
        queryBuilder.withPropertyValueConstraint(new PropertyValueConstraint(property));
        return queryBuilder.build();
    }
}

export default QueryUtils;