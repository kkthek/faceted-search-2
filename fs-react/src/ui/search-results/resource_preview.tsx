import {Document} from "app/common/response/document";
import React, {Suspense, useContext, useRef, useState} from "react";
import {WikiContext} from "app/index";
import {BarLoader} from "react-spinners";
import ConfigUtils from "app/util/config_utils";
import EmbedWithNotification from "app/ui/search-results/embed_with_notification";

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