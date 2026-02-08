import React, {ReactNode, Suspense, use} from "react";

function Loader(prop: {
    loadPromise: Promise<any>,
    loaderComponent: ReactNode
}) {
    return <Suspense fallback={prop.loaderComponent}><Result loadPromise={prop.loadPromise} /></Suspense>
}
function Result(prop: { loadPromise: Promise<any> }) {
    if (!prop.loadPromise) return;
    use(prop.loadPromise);
    return <></>;
}

export default Loader;