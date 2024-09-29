import React from "react";
import {PropertyResponse, SolrDocumentsResponse, SolrFacetResponse} from "../common/datatypes";
import DocumentQueryBuilder from "../common/document_query_builder";
import Tools from "../util/tools";
import {FacetViewProperty} from "./facet_view";


function SelectedFacetsView(prop: {
    results: SolrFacetResponse,
    onPropertyClick: (p: PropertyResponse)=>void
}) {
    if (!prop.results) return;


    return <div id={'fs-selected-facetview'}>
        <ul>
            Test123
        </ul>
    </div>;
}

export default SelectedFacetsView;