import {Slider} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Property} from "../../common/property";
import EventHandler from "../../common/event_handler";
import Box from "@mui/material/Box";
import ObjectTools from "../../util/object_tools";
import {Range} from "../../common/range";
import {PropertyFacet} from "../../common/request/property_facet";
import {FacetValue} from "../../common/request/facet_value";
import Button from "@mui/material/Button";
import {FacetResponse} from "../../common/response/facet_response";

function SliderItem(prop: {
    property: Property,
    searchStateFacets: FacetResponse,
    eventHandler: EventHandler,
}) {
    const [range, setRange] = useState<Range>(Range.collapsedNumberRange());

    const propertyValueCount = prop.searchStateFacets?.getPropertyValueCount(prop.property);

    const values = ObjectTools.deepClone(propertyValueCount?.values);
    const first = values?.shift();
    const last = values?.pop();
    const min = first ? parseFloat(String(first.range.from)) : undefined;
    const max = last ? parseFloat(String(last.range.to)) : undefined;

    useEffect(() => {
        setRange(new Range(min, max));
    }, [min, max]);

    const onOK = () => {
        const propertyFacet = new PropertyFacet(prop.property, [FacetValue.fromRange(range)]);
        prop.eventHandler.onValueClick(propertyFacet);
    }
    const handleChange = (event: Event, newValue: number[]) => {
        setRange(new Range(newValue[0], newValue[1]));
    };

    return (
        <Box sx={{ width: '70%', display: 'flex', alignItems: 'center' }}>

            <Slider
                value={[range.from as number, range.to as number]}
                onChange={handleChange}
                valueLabelDisplay="auto"
                getAriaValueText={(value: number) => `${value}`}
                min={min}
                max={max}
            />
            <Button onClick={onOK}>OK</Button>

        </Box>
    );
}

export default SliderItem;