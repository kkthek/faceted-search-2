import {use} from "react";

function Loader(prop: { loadPromise: Promise<any> }) {
    if (!prop.loadPromise) return;
    use(prop.loadPromise);
    return <></>;
}

export default Loader;