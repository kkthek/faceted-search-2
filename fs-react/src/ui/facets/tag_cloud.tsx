import React, {useContext} from "react";
import {Tag, TagCloud} from 'react-tagcloud';
import EventHandler from "../../common/event_handler";
import {Datatype, SearchStateFacet, TextFilters} from "../../common/datatypes";
import {WikiContext} from "../../index";
import FacetFilter from "./facet_filter";
import {Property} from "../../common/property";
import {FacetValue} from "../../common/request/facet_value";
import {PropertyFacet} from "../../common/request/property_facet";
import {ValueCount} from "../../common/response/value_count";

function TagCloudFacet(prop: {
    searchStateFacets: SearchStateFacet,
    eventHandler: EventHandler
    textFilters: TextFilters
}) {

    if (!prop.searchStateFacets) return;
    const wikiContext = useContext(WikiContext);
    const fs2gTagCloudProperty = wikiContext.config['fs2gTagCloudProperty'];
    if (!fs2gTagCloudProperty) return;

    let tagProperty = new Property(fs2gTagCloudProperty, Datatype.string);
    const tagPropertyValues = prop.searchStateFacets.facetsResponse.getPropertyValueCount(tagProperty);
    if (!tagPropertyValues) return;

    const tags = tagPropertyValues.values.map((v) => (
        {
            value: v.value.toString(),
            count: v.count,
            props: {value: v}
        }
    ));

    const onClick = (tag: Tag) => {
        const props = tag.props as { value: ValueCount };
        const facetValue = FacetValue.fromValueCount(props.value);
        const propertyFacet = new PropertyFacet(tagProperty, [facetValue]);
        prop.eventHandler.onValueClick(propertyFacet);

    };

    return <div id={'fs-tagcloud'}>
        <div>
            <FacetFilter eventHandler={prop.eventHandler}
                         numberOfValues={tags.length}
                         property={tagProperty}
                         width={'100%'}
                         textFilters={prop.textFilters}
            />
        </div>
        <div id={'fs-tagcloud-container'} style={{width: '100%'}}>
            <TagCloud
                minSize={12}
                maxSize={35}
                tags={tags}
                colorOptions={{luminosity: 'dark', hue: '#023fff'}}
                onClick={onClick}
            />
        </div>
    </div>
}

export default TagCloudFacet;