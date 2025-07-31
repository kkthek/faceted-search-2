import * as React from 'react';
import {SyntheticEvent, useContext, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {BaseQuery, FacetResponse, FacetValue, Property, PropertyFacet, ValueCount} from "../common/datatypes";
import {Box, FormGroup, TextField} from "@mui/material";
import FacetOrDialogContent from "./facet_or_dialog_content";
import {WikiContext} from "../index";
import Tools from "../util/tools";
import {useDebounce} from "../util/custom_hooks";
import EventHandler from "../common/event_handler";
import Client from "../common/client";
import QueryUtils from "../util/query_utils";

function FacetOrDialog(prop: {
        open: boolean,
        client: Client,
        handleClose: () => void,
        searchStateFacets: FacetResponse,
        baseQuery: BaseQuery,
        property: Property,
        eventHandler: EventHandler

}) {
    const wikiContext = useContext(WikiContext);
    const [searchText, setSearchText] = useState((): string => '');
    const debouncedSearchText = useDebounce(searchText, 300);

    if (!prop.property) return;
    const pvc = prop.searchStateFacets?.getPropertyValueCount(prop.property);
    if (!pvc) return;

    const facet = prop.baseQuery.findPropertyFacet(prop.property);
    let selectedValues: FacetValue[] = facet == null ? [] : facet.values;
    const onDialogContentChange = function(e: SyntheticEvent, checked: boolean, v: ValueCount) {
        let facetValue = new FacetValue(v.value, v.mwTitle, v.range);
        if (checked) {
            selectedValues.push(facetValue);
        } else {
            Tools.removeFirstByPredicate(selectedValues, (f) => f.equals(facetValue))
        }

    }

    const onDialogContentBulkChange = function(e: SyntheticEvent, values: ValueCount[]) {
        selectedValues = values.map((v) => {
            return new FacetValue(v.value, v.mwTitle, v.range);
        });
    }

    const onOK = function() {
        if (selectedValues.length === 0) {
            prop.eventHandler.onRemoveAllFacetsForProperty(prop.property);
        } else {
            prop.eventHandler.onValueClick(new PropertyFacet(prop.property, selectedValues));
        }
        prop.handleClose();
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
                                                  selectedValues={selectedValues}
                                                  property={prop.property}
                                                  onChange={onDialogContentChange}
                                                  onBulkChange={onDialogContentBulkChange}
                                                  filterText={debouncedSearchText}
                                                  client={prop.client}
                            />
                        </Box>
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={prop.handleClose}>Cancel</Button>
                    <Button onClick={onOK} autoFocus>Ok</Button>
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

    static createORDialogState(baseQuery: BaseQuery, client: Client): [ORDialogInput, ()=>void, (p: Property)=>void] {
        const [openOrDialog, setOpenOrDialog] = useState<ORDialogInput>(new ORDialogInput());

        const handleCloseFacetOrDialog = function() {
            setOpenOrDialog(new ORDialogInput());
        };


        const onOrDialogClick = function(p: Property): void {

            let query = QueryUtils.prepareQueryWithoutFacet(baseQuery, p);
            client.searchFacets(query).then((facetResponse) => {
                setOpenOrDialog(new ORDialogInput(true, p, facetResponse));
            });
        }

        return [openOrDialog, handleCloseFacetOrDialog, onOrDialogClick];
    }
}

