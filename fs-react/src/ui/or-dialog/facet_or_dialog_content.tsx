import {FacetResponse, FacetValue, Property, ValueCount} from "../../common/datatypes";
import Tools from "../../util/tools";
import DisplayTools from "../../util/display_tools";
import {Grid, Typography} from "@mui/material";
import * as React from "react";
import {SyntheticEvent, useContext} from "react";
import {WikiContext} from "../../index";
import Client from "../../common/client";
import PropertyValueGrid from "./property_value_grid";
import PropertyValueTree from "./property_value_tree";

function FacetOrDialogContent(prop: {
    client: Client,
    searchStateFacets: FacetResponse,
    selectedValues: FacetValue[],
    property: Property,
    onChange: (e: SyntheticEvent, checked: boolean, v: ValueCount) => void,
    onBulkChange: (e: SyntheticEvent, v: ValueCount[]) => void,
    filterText: string
}) {
    const wikiContext = useContext(WikiContext);
    let valueCounts = prop.searchStateFacets?.getPropertyValueCount(prop.property).values;
    let filterTextsLowercase = prop.filterText.toLowerCase().split(/\s+/);

    valueCounts = valueCounts.filter((v) => {
        let serializedFacetValue = DisplayTools.serializeFacetValue(prop.property, v);
        return filterTextsLowercase.length === 0 ||
            filterTextsLowercase.every((s) => serializedFacetValue.toLowerCase().indexOf(s) > -1);

    });

    if (prop.property.isRangeProperty() || prop.property.isBooleanProperty()) {
        return <Grid container spacing={2}>
            <Typography>Properties of type "datetime", "number" or "boolean" cannot be used with OR</Typography>
        </Grid>;
    }

    const selectedItemIds = valueCounts
        .filter((value) => prop.selectedValues.findFirst(
            (e: FacetValue) => e.containsValueOrMWTitle(value.value, value.mwTitle)) != null)
        .map(v => v.mwTitle ? v.mwTitle.title : v.value.toString());

    const groupConfiguration = wikiContext.config.fs2gPropertyGrouping[prop.property.title]
        || wikiContext.config.fs2gPropertyGroupingBySeparator[prop.property.title]
        || wikiContext.config.fs2gPropertyGroupingByUrl[prop.property.title];

    if (groupConfiguration) {
        return <PropertyValueTree property={prop.property}
                                  valueCounts={valueCounts}
                                  selectedItemIds={selectedItemIds}
                                  onBulkChange={prop.onBulkChange}
                                  client={prop.client}
        />;
    } else {
        return <PropertyValueGrid property={prop.property}
                                  valueCounts={valueCounts}
                                  selectedItemIds={selectedItemIds}
                                  onChange={prop.onChange}/>
    }

}

export default FacetOrDialogContent;