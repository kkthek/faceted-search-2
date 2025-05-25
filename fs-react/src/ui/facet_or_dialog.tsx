import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {FacetResponse, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import {Box, FormGroup, TextField} from "@mui/material";
import FacetOrDialogContent from "./facet_or_dialog_content";
import {Dispatch, SetStateAction, SyntheticEvent, useContext, useEffect, useState} from "react";
import {WikiContext} from "../index";
import Tools from "../util/tools";
import {useDebounce} from "../util/custom_hooks";
import EventHandler from "../common/event_handler";

function FacetOrDialog(prop: {
        open: boolean,
        handleClose: () => void,
        searchStateFacets: FacetResponse,
        selectedFacets: PropertyFacet[],
        property: Property,
        eventHandler: EventHandler

}) {
    let wikiContext = useContext(WikiContext);
    const [searchText, setSearchText] = useState((): string => '');
    const debouncedSearchText = useDebounce(searchText, 300);

    if (!prop.property) return;
    let pvc = prop.searchStateFacets?.getPropertyValueCount(prop.property);
    if (!pvc) return;

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

    let onBulkChange = function(e: SyntheticEvent, values: ValueCount[]) {
        selectedFacets = values.map((v) => {
            let propertyFacet = new PropertyFacet(
                prop.property.title,
                prop.property.type,
                v.value, v.mwTitle, v.range);
            propertyFacet.setORed(true);
            return propertyFacet;
        });
    }

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
                    <TextField id="fs-dialog-or-search"
                               label={'Search...'}
                               size={'small'}
                               sx={{width: '100%', marginTop: '15px'}}
                               onChange={(event) => {
                                    setSearchText(event.target.value);
                               }}
                               variant="outlined"/>
                    <FormGroup>
                        <Box className={'fs-or-content'}>
                            <FacetOrDialogContent searchStateFacets={prop.searchStateFacets}
                                                  selectedFacets={selectedFacets}
                                                  property={prop.property}
                                                  onChange={onChange}
                                                  onBulkChange={onBulkChange}
                                                  filterText={debouncedSearchText}

                            />
                        </Box>
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={prop.handleClose}>Cancel</Button>
                    <Button onClick={() => {
                        if (selectedFacets.length === 0) {
                            prop.eventHandler.onRemoveAllFacetsForProperty(prop.property);
                        } else {
                            prop.eventHandler.onValuesClick(selectedFacets);
                        }
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
