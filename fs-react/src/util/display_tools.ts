import {useContext} from "react";
import {ElementWithURL} from "app/common/datatypes";
import {WikiContext} from "app/index";

class DisplayTools {
    static getDisplayTitle(elementWithURL: ElementWithURL) {
        const wikiContext = useContext(WikiContext);
        const fs2SMWLanguage = wikiContext.config['fs2gSMWLanguage'] ?? {};
        const displayTitle = elementWithURL.getDisplayTitle();
        return fs2SMWLanguage[elementWithURL.getTitle()] ?? displayTitle;
    }
}

export default DisplayTools;
