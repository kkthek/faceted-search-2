import {RefObject} from "react";

class GisBrowserApi {

    private iframe: RefObject<any>;

    constructor(iframe: RefObject<any>) {
        this.iframe = iframe;
    }

    getCoordinatesFromGIS() {

        const olApi = this.iframe.current.contentWindow.Api;
        const extent = olApi.base.ViewerState.map.getExtent();

        const miny = Math.floor(extent.left);
        const maxy = Math.floor(extent.right);
        const minx = Math.floor(extent.bottom);
        const maxx = Math.floor(extent.top);

        return [minx, maxx, miny, maxy];
    }

}

export default GisBrowserApi;