import {Datatype, Property} from "../common/datatypes";

class Config {

    /**
     * This is ONLY for development necessary. The real settings come from MW context
     *
     */
    static getDevDefaultSettings() {
        return {
            'wgFormattedNamespaces': {0: 'Main', 14: 'Category', 10: 'Template'},

            // FacetedSearch options
            'fsg2FacetValueLimit': 20,
            'fsg2ExtraPropertiesToRequest': [ new Property("Has spouse", Datatype.wikipage),
                new Property("Has age", Datatype.number), new Property("Was born at", Datatype.datetime)],
            'fsg2AnnotationsInSnippet' : { 'Employee': ['Has spouse', 'Has age', 'Was born at'] },
            'fsg2CategoriesToShowInTitle': ['Employee'],
            'fsg2DefaultSortOrder' : 'newest'
        }
    }
}

export default Config;