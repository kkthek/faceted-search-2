import {Document} from "../common/datatypes";
import React, {useContext} from "react";
import {WikiContext} from "../index";
import WikiLink from "./wiki_link";
import ValueSerializer from "../util/value_serializer";
import {Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import Tools, {Tuple} from "../util/tools";


function Annotations(prop: {doc: Document}) {
    let wikiContext = useContext(WikiContext);
    let annotationsInSnippets = wikiContext.config['fs2gAnnotationsInSnippet'];

    for(let category in annotationsInSnippets) {
        let categoryFound = prop.doc.getCategoryFacetValue(category) != null;
        if (!categoryFound) continue;

        let rows = Tools.arrayOf2Tuples(annotationsInSnippets[category]).map((tuples: Tuple<string>) => {
            let pfvCell1 = prop.doc.getPropertyFacetValues(tuples.first);
            let pfvCell2 = tuples.second ? prop.doc.getPropertyFacetValues(tuples.second) : null;

            return  <TableRow key={'annotation-'+prop.doc.id+'-'+tuples.first}>
                        <TableCell>
                            <WikiLink page={pfvCell1.property}/>:
                            {ValueSerializer.getValues(pfvCell1)}
                        </TableCell>
                        <TableCell>
                            <WikiLink page={pfvCell2?.property}/> {pfvCell2 ? ':':''}
                            {ValueSerializer.getValues(pfvCell2)}
                        </TableCell>
            </TableRow>
        });
        return <Table size="small" aria-label="simple table"><TableBody>{rows}</TableBody></Table>

    }
    return <div></div>;
}

export default Annotations;