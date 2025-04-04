import {Datatype, Property} from "../common/datatypes";

class Config {

    static getDevDefaultSettings() {
        return {
            'wgFormattedNamespaces': {0: 'Main', 14: 'Category', 10: 'Template'},

            // FacetedSearch options
            'fsgFacetValueLimit': 20,
            'fsgExtraPropertiesToRequest': [ new Property("Has spouse", Datatype.wikipage),
                new Property("Has age", Datatype.number), new Property("Was born at", Datatype.datetime)],
            'fsgAnnotationsInSnippet' : { 'Employee': ['Has spouse', 'Has age', 'Was born at'] }
        }
    }
}

export default Config;