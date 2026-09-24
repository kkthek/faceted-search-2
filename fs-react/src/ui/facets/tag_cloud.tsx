import React, {useContext} from "react";
import {Tag, TagCloud} from 'react-tagcloud';
import {Datatype, SearchStateFacet} from "app/common/datatypes";
import EventHandler from "app/common/event_handler";
import {WikiContext} from "app/index";
import {Property} from "app/common/property";
import {ValueCount} from "app/common/response/value_count";
import {FacetValue} from "app/common/request/facet_value";
import {PropertyFacet} from "app/common/request/property_facet";
import FacetFilter from "app/ui/facets/facet_filter";

function TagCloudFacet(prop: {
    searchStateFacets: SearchStateFacet,
    eventHandler: EventHandler
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
            value: v.value ? v.value.toString() : null,
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
                         searchStateFacets={prop.searchStateFacets}
                         numberOfValues={tags.length}
                         property={tagProperty}
                         width={'100%'}

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