import React, {useContext} from "react";

import ChecklistIcon from '@mui/icons-material/Checklist';
import DateRangeIcon from '@mui/icons-material/DateRange';
import {FacetResponse} from "app/common/response/facet_response";
import {PropertyFacetCount} from "app/common/response/property_facet_count";
import EventHandler from "app/common/event_handler";
import {Property} from "app/common/property";
import {WikiContext} from "app/index";
import FacetValues from "app/ui/facets/facet_values_view";
import ShowAllButton from "app/ui/facets/show_all_button";
import CustomTreeItem from "app/custom_ui/custom_tree_item";
import FacetFilter from "app/ui/facets/facet_filter";
import SliderItem from "app/ui/facets/slider_item";
import IdTools from "app/util/id_tools";
import FacetWithCount from "app/ui/common/facet_with_count";
import DisplayTools from "app/util/display_tools";
import {SearchStateDocument, SearchStateFacet} from "app/common/datatypes";


function FacetViewProperty(prop: {
    searchStateDocument: SearchStateDocument,
    searchStateFacets: SearchStateFacet,
    facetResponse: FacetResponse,
    propertyFacetCount: PropertyFacetCount,
    eventHandler: EventHandler
    onOrDialogClick: (property: Property) => void
    onDateRangeDialog: (property: Property) => void,
}) {

    const property =  prop.propertyFacetCount.property;
    const propertyValueCount = prop.facetResponse?.getPropertyValueCount(property);
    const isSelectedFacet = prop.searchStateDocument.query.findPropertyFacet(property) !== null;
    if (isSelectedFacet) return;

    const wikiContext = useContext(WikiContext);
    const facetsWithOr = wikiContext.config['fs2gFacetsWithOR'].includes(property.title);

    const facetTreeItems = propertyValueCount?.values.map((v, i) => {
        return <FacetValues key={property.title + i}
                            propertyValueCount={v}
                            property={property}
                            eventHandler={prop.eventHandler}
        />
    });

    let showAllTreeItem;
    const showAll = propertyValueCount?.values.length === wikiContext.config.fs2gFacetValueLimit &&
        !(property.isRangeProperty() || property.isBooleanProperty());
    if (showAll) {
        showAllTreeItem = <ShowAllButton property={property}
                                         searchStateFacets={prop.searchStateFacets}
                                         eventHandler={prop.eventHandler}
        />
    }

    const filterTreeItem = <CustomTreeItem itemId={property.title+"-filter"}
                                         label={<FacetFilter eventHandler={prop.eventHandler}
                                                             searchStateFacets={prop.searchStateFacets}
                                                             numberOfValues={propertyValueCount?.values.length}
                                                             property={propertyValueCount?.property}

                                         />}
    />;

    let sliderItem;
    if (property.isNumericProperty()) {
        sliderItem = <CustomTreeItem itemId={property.title+"-slider"}
                                     label={<SliderItem eventHandler={prop.eventHandler}
                                                        facetResponse={prop.facetResponse}
                                                         property={property}/>}
        />
    }

    let getActionIcon = () => {
        if (facetsWithOr) {
            return ChecklistIcon;
        } else if(property.isDateTimeProperty()) {
            return DateRangeIcon;
        }
        return null;
    }
    let action = () => {
        if (facetsWithOr) {
            prop.onOrDialogClick(property);
        } else if (property.isDateTimeProperty()) {
            prop.onDateRangeDialog(property);
        }
    }
    return <CustomTreeItem itemId={IdTools.createItemIdForProperty(property)}
                           label={<FacetWithCount displayTitle={DisplayTools.getDisplayTitle(property)} count={prop.propertyFacetCount?.count}/>}
                           itemAction={() => prop.eventHandler.onPropertyClick(property)}
                           actionIcon={getActionIcon()}
                           action={action}
                           className={'fs-facets'}>
        {filterTreeItem}
        {sliderItem}
        {facetTreeItems}
        {showAllTreeItem}

    </CustomTreeItem>
}

export default FacetViewProperty;