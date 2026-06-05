import {Property} from "../../common/property";
import {FacetResponse} from "../../common/response/facet_response";
import {BaseQuery} from "../../common/request/base_query";
import Client from "../../common/client";
import {Dispatch, SetStateAction, useState} from "react";
import QueryUtils from "../../util/query_utils";

export class DateRangeDialogInput {
    open: boolean;
    property: Property;
    facetResponse: FacetResponse;

    constructor(open: boolean = false, property: Property = null, facetResponse: FacetResponse = null) {
        this.open = open;
        this.property = property;
        this.facetResponse = facetResponse;
    }

    static createDateRangeDialogState(baseQuery: BaseQuery, client: Client,
                                      setLoadPromise: Dispatch<SetStateAction<Promise<any>>>): [DateRangeDialogInput, () => void, (p: Property) => void] {
        const [openDateRangeDialog, setOpenDateRangeDialog] = useState<DateRangeDialogInput>(new DateRangeDialogInput());

        const handleCloseDateRangeDialog = function () {
            setOpenDateRangeDialog(new DateRangeDialogInput());
        };


        const onDateRangeDialogClick = function (p: Property) {

            const query = QueryUtils.prepareRangeQueryWithoutFacet(baseQuery, p);
            setLoadPromise(async function() {
                const response = await client.searchFacets(query);
                setOpenDateRangeDialog(new DateRangeDialogInput(true, p, response));
            });


        }

        return [openDateRangeDialog, handleCloseDateRangeDialog, onDateRangeDialogClick];
    }
}