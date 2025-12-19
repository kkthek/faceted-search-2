import React, {use} from "react";

const EmbedWithLoading = function EmbedWithLoading(prop: {
    isShownPromise: Promise<boolean>
    url: string,
    mimeType: string
    onLoad: () => void
}) {

   const isShown = use(prop.isShownPromise);

   return <embed src={prop.url}
                  width="800"
                  height="600"
                  type={prop.mimeType}
                  onLoad={prop.onLoad}
                  hidden={!isShown}

    />

}

export default EmbedWithLoading;
