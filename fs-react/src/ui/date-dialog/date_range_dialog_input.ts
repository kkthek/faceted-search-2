import {Property} from "../../common/property";
import {FacetResponse} from "../../common/response/facet_response";
import {BaseQuery} from "../../common/request/base_query";
import Client from "../../common/client";
import {useState} from "react";
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

    static createDateRangeDialogState(baseQuery: BaseQuery, client: Client): [DateRangeDialogInput, () => void, (p: Property) => void] {
        const [openDateRangeDialog, setOpenDateRangeDialog] = useState<DateRangeDialogInput>(new DateRangeDialogInput());

        const handleCloseDateRangeDialog = function () {
            setOpenDateRangeDialog(new DateRangeDialogInput());
        };


        const onDateRangeDialogClick = async function (p: Property): Promise<void> {

            const query = QueryUtils.prepareRangeQueryWithoutFacet(baseQuery, p);
            const facetResponse = await client.searchFacets(query);
            setOpenDateRangeDialog(new DateRangeDialogInput(true, p, facetResponse));

        }

        return [openDateRangeDialog, handleCloseDateRangeDialog, onDateRangeDialogClick];
    }
}