import * as React from 'react';
import {SyntheticEvent} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Datatype, FacetResponse, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import {Checkbox, FormControlLabel, FormGroup, Grid} from "@mui/material";
import DisplayTools from "../util/display_tools";
import Tools from "../util/tools";

function FacetOrDialog(prop: {
        open: boolean,
        handleClose: () => void,
        searchStateFacets: FacetResponse,
        selectedFacets: PropertyFacet[],
        property: Property,
        onValuesClick: (p: PropertyFacet[])=>void
}) {
    if (!prop.property) return;
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

    let values = [];
    const valueCounts = prop.searchStateFacets?.getPropertyValueCount(prop.property).values;
    if (prop.property.type === Datatype.boolean
        || prop.property.type === Datatype.datetime
        || prop.property.type === Datatype.number) {
        values.push(<div>Properties of type "datetime", "number" or "boolean" cannot be used with OR</div>)
    } else {

        let rows: ValueCount[][] = Tools.splitArray2NTuples(valueCounts, 3);

        rows.forEach((row) => {
            values.push(row.map((value) => {
                let selectedValue = DisplayTools.serializeFacetValue(prop.property, value);
                selectedValue += "("+value.count+")";
                return <Grid size={4}>
                            <FormControlLabel
                                key={selectedValue}
                                control={<Checkbox/>}
                                onChange={(event, checked) => {
                                             onChange(event, checked, value)
                                         }}
                                label={selectedValue}/>
                </Grid>;
            }));

        });

    };

    return (
        <React.Fragment>
            <Dialog
                open={prop.open}
                onClose={prop.handleClose}
                maxWidth={'md'}

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
                        <Grid container spacing={2}>
                        {values}
                        </Grid>
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={prop.handleClose}>Cancel</Button>
                    <Button onClick={() => {
                        prop.onValuesClick(selectedFacets);
                        prop.handleClose();
                    }} autoFocus>Ok</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default FacetOrDialog;
