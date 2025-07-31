import {Document} from "../common/datatypes";
import React, {useContext} from "react";
import {WikiContext} from "../index";
import WikiLink from "./wiki_link";
import ValueSerializer from "../util/value_serializer";
import {Box, Table, TableBody, TableCell, TableRow} from "@mui/material";
import Tools from "../util/tools";


function Annotations(prop: {doc: Document}) {
    const wikiContext = useContext(WikiContext);
    const annotationsInSnippets = wikiContext.config['fs2gAnnotationsInSnippet'];

    for(let category in annotationsInSnippets) {
        const categoryFound = prop.doc.getCategoryFacetValue(category) != null;
        if (!categoryFound) continue;

        let index = 0;
        const rows = Tools.splitArray2NTuples(annotationsInSnippets[category], 2)
            .map((tuples: string[]) => {

            const pfvCell1 = prop.doc.getPropertyFacetValues(tuples[0]);
            const pfvCell2 = tuples[1] ? prop.doc.getPropertyFacetValues(tuples[1]) : null;

            return  <TableRow key={'annotation-'+prop.doc.id+"_"+index++}>
                        <TableCell>
                            <WikiLink page={pfvCell1.property}/>: {ValueSerializer.getValues(pfvCell1)}
                        </TableCell>
                        <TableCell>
                            <WikiLink page={pfvCell2?.property}/>{pfvCell2 ? ': ':' '}{ValueSerializer.getValues(pfvCell2)}
                        </TableCell>
            </TableRow>
        });
        return <Box className={'fs-annotation-snippet'}>
            <Table size="small" aria-label="simple table">
            <TableBody>{rows}</TableBody>
        </Table>
        </Box>

    }

};

export default Annotations;