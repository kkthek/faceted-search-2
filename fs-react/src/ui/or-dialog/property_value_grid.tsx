import {Checkbox, FormControlLabel, Grid} from "@mui/material";
import * as React from "react";
import {SyntheticEvent, useContext} from "react";
import {Property} from "app/common/property";
import {ValueCount} from "app/common/response/value_count";
import {WikiContext} from "app/index";
import ConfigUtils from "app/util/config_utils";

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
                const selectedValue = value.getDisplayText(wikiContext);
                const selectedId = value.itemId();
                const isSelected = prop.selectedItemIds.includes(selectedId)

                return <Grid size={4} key={"grid-"+selectedValue}>
                    <FormControlLabel
                        key={selectedValue}
                        control={<Checkbox key={"checkbox-"+selectedValue} defaultChecked={isSelected}/>}
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