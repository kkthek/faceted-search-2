import {Property, ValueCount} from "../../common/datatypes";
import DisplayTools from "../../util/display_tools";
import {Checkbox, FormControlLabel, Grid} from "@mui/material";
import * as React from "react";
import {SyntheticEvent, useContext} from "react";
import ConfigUtils from "../../util/config_utils";
import {WikiContext} from "../../index";

function PropertyValueGrid(prop: {
    property: Property,
    selectedItemIds: string[],
    valueCounts: ValueCount[],
    onChange: (e: SyntheticEvent, checked: boolean, v: ValueCount) => void,
}) {

    const wikiContext = useContext(WikiContext);
    const sortOption = wikiContext.options['fs2-sort-order-preferences'];

    const values: any = [];

    prop.valueCounts
        .sort(ConfigUtils.getSortFunction(sortOption))
        .splitArray2NTuples(3)
        .forEach((row: ValueCount[]) => {
            values.push(row.map((value: ValueCount) => {
                const selectedValue = DisplayTools.serializeFacetValue(prop.property, value);
                const selectedId = value.serialize();
                const isSelected = prop.selectedItemIds.includes(selectedId)

                return <Grid size={4}>
                    <FormControlLabel
                        key={selectedValue}
                        control={<Checkbox defaultChecked={isSelected}/>}
                        onChange={(event, checked) => {
                            prop.onChange(event, checked, value);
                        }}
                        label={selectedValue + " (" + value.count + ")"}/>
                </Grid>;
            }));

        });
    return <Grid container spacing={2}>
        {values}
    </Grid>;
}

export default PropertyValueGrid;