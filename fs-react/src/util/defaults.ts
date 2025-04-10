import {Datatype, Property} from "../common/datatypes";

class Config {

    static getDevDefaultSettings() {
        return {
            'wgFormattedNamespaces': {0: 'Main', 14: 'Category', 10: 'Template'},

            // FacetedSearch options
            'fsg2FacetValueLimit': 20,
            'fsg2ExtraPropertiesToRequest': [ new Property("Has spouse", Datatype.wikipage),
                new Property("Has age", Datatype.number), new Property("Was born at", Datatype.datetime)],
            'fsg2AnnotationsInSnippet' : { 'Employee': ['Has spouse', 'Has age', 'Was born at'] },
            '': 8
        }
    }
}

export default Config;