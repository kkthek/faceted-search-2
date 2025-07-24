import * as React from 'react';
import {useContext, useRef} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {BaseQuery, Datatype, FacetValue, Property, PropertyFacet, Range} from "../common/datatypes";
import {Box} from "@mui/material";
import {WikiContext} from "../index";
import EventHandler from "../common/event_handler";
import Client from "../common/client";
import Tools from "../util/tools";

function GisDialog(prop: {
    open: boolean,
    handleClose: () => void,
    baseQuery: BaseQuery,
    eventHandler: EventHandler

}) {
    const PROPERTY_COORDINATE_X = new Property('KoordinateX', Datatype.number);
    const PROPERTY_COORDINATE_Y = new Property('KoordinateY', Datatype.number);

    const wikiContext = useContext(WikiContext);
    const iframe = useRef<any>(null);
    const apiEndpoint = wikiContext.globals.mwApiUrl;

    const iframeUrl = new URL(apiEndpoint);
    iframeUrl.searchParams.set('action', 'odbgeo');
    iframeUrl.searchParams.set('method', 'getiFrame');
    iframeUrl.searchParams.set('mode', '');
    iframeUrl.searchParams.set('topic', '');
    iframeUrl.searchParams.set('id', 'GIS_for_Test');
    iframeUrl.searchParams.set('width', '450px');
    iframeUrl.searchParams.set('height', '450px');

    const selectedLocation = getSelectedLocation();
    if (selectedLocation !== null) {
        console.log(selectedLocation);
        iframeUrl.searchParams.set('location', selectedLocation);
    }

    function selectNewLocation() {
        console.log(iframe.current);
        const olapi = iframe.current.contentWindow.Api;
        console.log(olapi);
        const extent = olapi.base.ViewerState.map.getExtent();

        const miny = Math.floor(extent.left);
        const maxy = Math.floor(extent.right);
        const minx = Math.floor(extent.bottom);
        const maxx = Math.floor(extent.top);

        const koordX = new PropertyFacet(PROPERTY_COORDINATE_X,[FacetValue.fromRange(new Range(minx, maxx))]);
        const koordY = new PropertyFacet(PROPERTY_COORDINATE_Y,[FacetValue.fromRange(new Range(miny, maxy))]);

        prop.eventHandler.onValuesClick([koordX, koordY]);
    }

    function getSelectedLocation() {
        const koordX = prop.baseQuery.findPropertyFacet(PROPERTY_COORDINATE_X);
        const koordY = prop.baseQuery.findPropertyFacet(PROPERTY_COORDINATE_Y);
        if (koordX === null || koordY === null) {
            return null;
        }
        const koordXRange = koordX.values[0].range;
        const koordYRange = koordY.values[0].range;
        const minx = Math.floor((koordXRange as Range).from as number);
        const miny = Math.floor((koordYRange as Range).from as number);
        const maxx = Math.floor((koordXRange as Range).to as number);
        const maxy = Math.floor((koordYRange as Range).to as number);
        return `${miny},${minx},${maxy},${maxx}`;

    }

    return (
        <React.Fragment>
            <Dialog
                open={prop.open}
                onClose={prop.handleClose}
                PaperProps={{
                    sx: {
                        width: "525px",
                        height: "640px"
                    }
                }}
                aria-labelledby="gis-dialog-title"
                aria-describedby="gis-dialog-description"
            >
                <DialogTitle id="fs-gis-map-title">
                    {wikiContext.msg('fs-gis-map-title')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="gis-dialog-description">
                        {wikiContext.msg('fs-facet-gis')}
                    </DialogContentText>

                    <Box id={'fs-gis-content'}>
                        <iframe style={{'width': '470px', 'height': '470px'}} ref={iframe} src={iframeUrl.toString()}/>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={prop.handleClose}>Cancel</Button>
                    <Button onClick={() => {
                        selectNewLocation();
                        prop.handleClose();
                    }} autoFocus>Ok</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default GisDialog;