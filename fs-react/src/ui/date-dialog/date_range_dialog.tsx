import "dayjs/locale/de";
import "dayjs/locale/de-at";
import "dayjs/locale/de-ch";
import "dayjs/locale/en";
import "dayjs/locale/en-gb";

import * as React from 'react';
import {useContext, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Box, FormGroup} from "@mui/material";
import {WikiContext} from "../../index";
import EventHandler from "../../common/event_handler";
import {Property} from "../../common/property";
import {FacetValue} from "../../common/request/facet_value";
import {FacetResponse} from "../../common/response/facet_response";
import {DatePicker} from "@mui/x-date-pickers";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import {PropertyFacet} from "../../common/request/property_facet";
import {Range} from "../../common/range";
import ObjectTools from "../../util/object_tools";

function DateRangeDialog(prop: {
    open: boolean,
    handleClose: () => void,
    searchStateFacets: FacetResponse,
    property: Property,
    eventHandler: EventHandler

}) {
    const wikiContext = useContext(WikiContext);
    const [range, setRange] = useState<Range>(Range.collapsedDateTimeRange());

    const propertyValueCount = prop.searchStateFacets?.getPropertyValueCount(prop.property);
    if (!propertyValueCount) return;

    const values = ObjectTools.deepClone(propertyValueCount.values);
    const first = values.length === 1 ? values[0] : values.shift();
    const last = values.length === 1 ?  values[0] : values.pop();
    const minDate = first?.range.from as Date;
    const maxDate = last?.range.to as Date;

    if (minDate && maxDate && !range.equals(new Range(minDate, maxDate))) {
        setRange(new Range(minDate, maxDate));
    }

    const onOK = function() {

        const propertyFacet = new PropertyFacet(prop.property, [FacetValue.fromRange(range)]);
        prop.eventHandler.onValueClick(propertyFacet);
        prop.handleClose();
    }

    return (
        <>
            <Dialog
                open={prop.open}
                onClose={prop.handleClose}
                maxWidth={'md'}

                aria-labelledby="fs-date-range-dialog-title"
                aria-describedby="fs-date-range-dialog-description"
            >
                <DialogTitle id="fs-date-range-dialog-title">
                    {wikiContext.msg('fs-date-range')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="fs-date-range-dialog-description">
                        {wikiContext.msg('fs-facet-date-range-dialog-title')}
                    </DialogContentText>

                    <FormGroup>
                        <Box sx={{marginTop: '20px'}} className={'fs-date-range-content'}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={wikiContext.getLocale()}>
                            <DatePicker label={wikiContext.msg('fs-from')} value={dayjs(range.from)}
                                        onChange={(newValue) => {
                                            setRange(new Range(newValue.toDate(), range.to))
                                        }
                            } />
                            <DatePicker sx={{marginLeft: '10px'}} label={wikiContext.msg('fs-to')} value={dayjs(range.to)}
                                        onChange={(newValue) => {
                                            setRange(new Range(range.from, newValue.toDate()))
                                        }
                            } />
                            </LocalizationProvider>
                        </Box>
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={prop.handleClose}>{wikiContext.msg('fs-cancel')}</Button>
                    <Button onClick={onOK} autoFocus>{wikiContext.msg('fs-ok')}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DateRangeDialog;



