import {jsonMember, jsonObject} from "typedjson";
import {Property} from "../property";
import {ElementWithURL} from "../datatypes";
import {useContext} from "react";
import {WikiContext} from "../../index";

@jsonObject
export class PropertyWithURL extends Property implements ElementWithURL {
    @jsonMember(String)
    displayTitle: string;
    @jsonMember(String)
    url: string

    asProperty(): Property {
        return new Property(this.title, this.type);
    }

    getDisplayTitle() {
        const wikiContext = useContext(WikiContext);
        const fs2SMWLanguage = wikiContext.config['fs2gSMWLanguage'] ?? {};
        let displayTitle = this.displayTitle;
        if (fs2SMWLanguage[this.title] !== undefined) {
            displayTitle = fs2SMWLanguage[this.title];
        }
        return displayTitle;
    }
}