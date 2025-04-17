import * as React from 'react';
import {SyntheticEvent} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Datatype, FacetResponse, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import DisplayTools from "../util/display_tools";

function FacetOrDialog(prop: {
        open: boolean,
        handleClose: () => void,
        searchStateFacets: FacetResponse,
        selectedFacets: PropertyFacet[],
        property: Property,
        onValuesClick: (p: PropertyFacet[])=>void
}) {
    let pvc = prop.searchStateFacets?.getPropertyValueCount(prop.property);
    if (!pvc) return;

    let selectedFacets: PropertyFacet[] = []
    let onChange = function(e: SyntheticEvent, checked: boolean, v: ValueCount) {
        let propertyFacet = new PropertyFacet(
            prop.property.title,
            prop.property.type,
            v.value, v.mwTitle, v.range);
        propertyFacet.setORed(true);
        selectedFacets.push(propertyFacet);

    }

    let values;
    if (prop.property.type === Datatype.boolean
        || prop.property.type === Datatype.datetime
        || prop.property.type === Datatype.number) {
        values = <div>Properties of type "datetime", "number" or "boolean" cannot be used with OR</div>
    } else {

        values = prop.searchStateFacets?.getPropertyValueCount(prop.property).values.map((value) => {
            let selectedValue = DisplayTools.serializeFacetValue(prop.property, value);
            return <FormControlLabel key={selectedValue} control={<Checkbox/>}
                                     onChange={(event, checked) => {
                                         onChange(event, checked, value)
                                     }}
                                     label={selectedValue}/>;
        });
    }
    return (
        <React.Fragment>
            <Dialog
                open={prop.open}
                onClose={prop.handleClose}
                aria-labelledby="facet-or-dialog-title"
                aria-describedby="facet-or-dialog-description"
            >
                <DialogTitle id="facet-or-dialog-title">
                    {"Facet values"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="facet-or-dialog-description">
                        Select facet values
                    </DialogContentText>
                    <FormGroup>
                        {values}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={prop.handleClose}>Cancel</Button>
                    <Button onClick={() => prop.onValuesClick(selectedFacets)} autoFocus>Ok</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default FacetOrDialog;
