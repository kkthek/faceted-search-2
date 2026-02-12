import {Document} from "../../common/response/document";
import {Suspense, useContext, useRef, useState} from "react";
import {WikiContext} from "../../index";
import ConfigUtils from "../../util/config_utils";
import React from "react";
import EmbedWithNotification from "./embed_with_notification";
import {BarLoader} from "react-spinners";

function ResourcePreview(prop: { doc: Document }) {
    const wikiContext = useContext(WikiContext);
    const fileTypesToShowInOverlay = wikiContext.config['fs2gShowFileInOverlay'];

    const [isShownPromise, setIsShownPromise] = useState<Promise<boolean>>(Promise.resolve(false));
    const alreadyShown = useRef(false);

    function onLoadedData() {
        if (alreadyShown.current) return;
        alreadyShown.current = true;
        setIsShownPromise(Promise.resolve(true));
    }

    const validConfig = (typeof fileTypesToShowInOverlay === 'boolean' || fileTypesToShowInOverlay.length);
    if (!validConfig || fileTypesToShowInOverlay === true) {
        console.warn('fs2gShowFileInOverlay can either be set to "false" or to an array of file types, eg. ["pdf","png",... ].')
        return;
    }
    if (fileTypesToShowInOverlay === false) {
        return;
    }

    const url = ConfigUtils.getFileResourceURL(prop.doc);
    const fileExtension = ConfigUtils.getFileExtension(url);

    if (url === undefined || !fileTypesToShowInOverlay.includes(fileExtension)) {
        return;
    }

    const mimeType = ConfigUtils.getFileType(fileExtension);

    return  <Suspense fallback={<BarLoader />}>
                <EmbedWithNotification isShownPromise={isShownPromise}
                                       url={url}
                                       mimeType={mimeType}
                                       onLoad={onLoadedData}
                />
    </Suspense>
}

export default ResourcePreview;