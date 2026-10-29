import {ElementWithURL} from "app/common/datatypes";
import {WikiContextAccessor} from "app/common/wiki_context";

class DisplayTools {

    static getDisplayTitle(elementWithURL: ElementWithURL, wikiContext: WikiContextAccessor) {
        const fs2SMWLanguage = wikiContext.config['fs2gSMWLanguage'] ?? {};
        const displayTitle = elementWithURL.getDisplayTitle();
        return fs2SMWLanguage[elementWithURL.getTitle()] ?? displayTitle;
    }
}

export default DisplayTools;
