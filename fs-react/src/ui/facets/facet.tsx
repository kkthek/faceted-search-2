import React, {useContext} from "react";
import {SearchStateDocument, TextFilters} from "../../common/datatypes";
import IdTools from "../../util/id_tools";
import FacetValues from "./facet_values_view";
import EventHandler from "../../common/event_handler";
import {WikiContext} from "../../index";
import CustomTreeItem from "../../custom_ui/custom_tree_item";
import ChecklistIcon from '@mui/icons-material/Checklist';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FacetFilter from "./facet_filter";
import FacetWithCount from "../common/facet_with_count";
import Span from "../../custom_ui/span";
import {Property} from "../../common/property";
import {FacetResponse} from "../../common/response/facet_response";
import {PropertyFacetCount} from "../../common/response/property_facet_count";
import SliderItem from "./slider_item";


function FacetViewProperty(prop: {
    searchStateDocument: SearchStateDocument,
    searchStateFacets: FacetResponse,
    propertyFacetCount: PropertyFacetCount,
    eventHandler: EventHandler
    onOrDialogClick: (property: Property) => void
    onDateRangeDialog: (property: Property) => void,
    textFilters: TextFilters
}) {

    const property =  prop.propertyFacetCount.property;
    const propertyValueCount = prop.searchStateFacets?.getPropertyValueCount(property);
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
        showAllTreeItem = <CustomTreeItem itemId={property.title + "-showall"}
                                          label={<Span color={'secondary'}>{"[" + wikiContext.msg('fs-show-all') + "]"}</Span>}
                                          itemAction={() => {
                                              const filterText = prop.textFilters[property.title];
                                              prop.eventHandler.onShowAllValues(property, filterText);
                                          }}
        />;
    }

    const filterTreeItem = <CustomTreeItem itemId={property.title+"-filter"}
                                         label={<FacetFilter eventHandler={prop.eventHandler}
                                                             numberOfValues={propertyValueCount?.values.length}
                                                             property={propertyValueCount?.property}
                                                             textFilters={prop.textFilters}
                                         />}
    />;

    let sliderItem;
    if (property.isNumericProperty()) {
        sliderItem = <CustomTreeItem itemId={property.title+"-slider"}
                                     label={<SliderItem eventHandler={prop.eventHandler}
                                                        searchStateFacets={prop.searchStateFacets}
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
                                                                             label={<FacetWithCount displayTitle={property.displayTitle} count={prop.propertyFacetCount?.count}/>}
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