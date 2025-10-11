import React, {MutableRefObject} from "react";

class GisBrowserApi {

    private iframe: MutableRefObject<any>;

    constructor(iframe: React.MutableRefObject<any>) {
        this.iframe = iframe;
    }

    getCoordinatesFromGIS() {

        const olApi = this.iframe.current.contentWindow.Api;
        const extent = olApi.base.ViewerState.map.getExtent();

        const miny = Math.floor(extent.left);
        const maxy = Math.floor(extent.right);
        const minx = Math.floor(extent.bottom);
        const maxx = Math.floor(extent.top);

        return [miny, maxy, minx, maxx];
    }

}

export default GisBrowserApi;