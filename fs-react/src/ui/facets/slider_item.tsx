import {Slider} from "@mui/material";
import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {Property} from "app/common/property";
import {FacetResponse} from "app/common/response/facet_response";
import EventHandler from "app/common/event_handler";
import ObjectTools from "app/util/object_tools";
import {PropertyFacet} from "app/common/request/property_facet";
import {FacetValue} from "app/common/request/facet_value";
import {Range} from "app/common/range";

function SliderItem(prop: {
    property: Property,
    facetResponse: FacetResponse,
    eventHandler: EventHandler,
}) {
    const propertyValueCount = prop.facetResponse?.getPropertyValueCount(prop.property);
    if (!propertyValueCount) return;

    const [range, setRange] = useState<Range>(Range.collapsedNumberRange());

    const values = ObjectTools.deepClone(propertyValueCount.values);
    const first = values.length === 1 ? values[0] : values.shift();
    const last = values.length === 1 ?  values[0] : values.pop();
    const min = first?.range ? first.range.from as number : undefined;
    const max = last?.range ? last.range.to as number : undefined;

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