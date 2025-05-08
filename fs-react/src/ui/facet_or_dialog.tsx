import * as React from 'react';
import {SyntheticEvent, useContext} from 'react';
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
import {WikiContext} from "../index";

function FacetOrDialog(prop: {
        open: boolean,
        handleClose: () => void,
        searchStateFacets: FacetResponse,
        selectedFacets: PropertyFacet[],
        property: Property,
        onValuesClick: (p: PropertyFacet[], property: Property)=>void
}) {
    if (!prop.property) return;
    let pvc = prop.searchStateFacets?.getPropertyValueCount(prop.property);
    if (!pvc) return;

    let wikiContext = useContext(WikiContext);
    let selectedFacets = prop.selectedFacets.filter(e => e.property === prop.property.title);
    let onChange = function(e: SyntheticEvent, checked: boolean, v: ValueCount) {
        let propertyFacet = new PropertyFacet(
            prop.property.title,
            prop.property.type,
            v.value, v.mwTitle, v.range);
        propertyFacet.setORed(true);
        if (checked) {
            selectedFacets.push(propertyFacet);
        } else {
            Tools.removeFirstByPredicate(selectedFacets, (f) => f.equals(propertyFacet))
        }

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
                let isSelected = Tools.findFirstByPredicate(selectedFacets, (e)=> e.containsValueOrMWTitle(value)) != null;
                return <Grid size={4}>
                            <FormControlLabel
                                key={selectedValue}
                                control={<Checkbox defaultChecked={isSelected}/>}
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
                    {wikiContext.msg('fs-facet-values')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="facet-or-dialog-description">
                        {wikiContext.msg('fs-facet-ored-values')}
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
                        prop.onValuesClick(selectedFacets, prop.property);
                        prop.handleClose();
                    }} autoFocus>Ok</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default FacetOrDialog;

export class ORDialogInput {
    open: boolean;
    property: Property;
    facetResponse: FacetResponse;


    constructor(open: boolean = false, property: Property = null, facetResponse: FacetResponse = null) {
        this.open = open;
        this.property = property;
        this.facetResponse = facetResponse;
    }
}
