import React, {use} from "react";
import {Document} from "../../common/response/document";
import {Table, TableBody, TableCell, TableRow} from "@mui/material";
import {PropertyFacetValues} from "../../common/response/property_facet_values";
import WikiLink from "../common/wiki_link";
import ValueSerializer from "../../util/value_serializer";

const LoadProperties = function LoadProperties(prop: {
    documentPromise: Promise<Document>
}) {

    if (!prop.documentPromise) return;
    const document= use(prop.documentPromise);

    const rows = document.propertyFacets
        .sort(PropertyFacetValues.compareByProperty())
        .map((pfv) => {
            const key = 'article-properties-' + document.id + pfv.property.title;
            return <Row key={key} keyValue={key} pfv={pfv}/>
        });

    return <Table size="small" aria-label="simple table">
        <TableBody>{rows}</TableBody>
    </Table>

}

function Row(prop: { pfv: PropertyFacetValues, keyValue: string }) {
    return <TableRow>
        <TableCell><WikiLink page={prop.pfv.property}/></TableCell>
        <TableCell>{ValueSerializer.getValues(prop.pfv, prop.keyValue)}</TableCell>
    </TableRow>
}

export default LoadProperties;
