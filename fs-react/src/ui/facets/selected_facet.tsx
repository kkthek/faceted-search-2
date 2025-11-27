import React, {useContext, useRef} from "react";
import {TextFilters, Property, PropertyFacetCount, PropertyValueCount, Range,} from "../../common/datatypes";
import EventHandler, {SearchStateFacet} from "../../common/event_handler";
import CustomTreeItem from "../../custom_ui/custom_tree_item";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectedFacetValues from "./selected_facet_values_view";
import ChecklistIcon from "@mui/icons-material/Checklist";
import {WikiContext} from "../../index";
import Tools from "../../util/tools";
import FacetWithCount from "../common/facet_with_count";
import DisplayTools from "../../util/display_tools";
import FacetFilter from "./facet_filter";

function SelectedFacet(prop: {
    propertyValueCount: PropertyValueCount
    facetCount: PropertyFacetCount
    searchStateFacet: SearchStateFacet,
    eventHandler: EventHandler
    onOrDialogClick: (property: Property) => void
    textFilters: TextFilters
}) {
    const query = prop.searchStateFacet.query;
    const property = prop.propertyValueCount.property;
    const propertyFacet = query.findPropertyFacet(property);
    if (!propertyFacet) return;
    const isRemovable = !propertyFacet.hasValueOrMWTitle() || propertyFacet.hasRange();
    const wikiContext = useContext(WikiContext);
    const facetsWithOr = wikiContext.config['fs2gFacetsWithOR'].includes(property.title);

    const facetValues = prop.propertyValueCount.values.map((v,i ) => {

        return <SelectedFacetValues key={property.title + i}
                                    selectedPropertyFacet={propertyFacet}
                                    propertyValueCount={v}
                                    eventHandler={prop.eventHandler}
        />
    });

    const onPropertyActionClick = () => {
        if (isRemovable && facetValues.length > 0) {
            prop.eventHandler.onRemovePropertyFacet(propertyFacet)
        } else if (facetsWithOr) {
            prop.onOrDialogClick(property);
        }

    };

    let propertyActionIcon = null;
    if (isRemovable && facetValues.length > 0) {
        propertyActionIcon = DeleteIcon;
    } else if (facetsWithOr) {
        propertyActionIcon = ChecklistIcon;
    }

    let lastRangeTreeItem;
    if (propertyFacet.property.isRangeProperty()) {
        const lastConstraint = propertyFacet.values.at(propertyFacet.values.length - 1);
        if (lastConstraint && !lastConstraint.isEmpty()) {
            const r = lastConstraint.range as Range;
            lastRangeTreeItem = <CustomTreeItem key={property.title+'_lastRange'}
                                                itemId={Tools.createItemIdForProperty(property)+'_lastRange'}
                                                label={DisplayTools.displayRange(propertyFacet.property, r)}
                                                action={()=>prop.eventHandler.onRemovePropertyFacet(propertyFacet, lastConstraint)}
                                                actionIcon={DeleteIcon}
            />;
        }
    }

    let showAllTreeItem;
    const showAll = prop.propertyValueCount?.values.length === wikiContext.config.fs2gFacetValueLimit &&
        !(property.isRangeProperty() || property.isBooleanProperty());
    if (showAll) {
        showAllTreeItem = <CustomTreeItem itemId={property.title + "-showall"}
                                          label={"["+wikiContext.msg('fs-show-all')+"]"}
                                          itemAction={() => {
                                              const filterText = prop.textFilters[property.title];
                                              prop.eventHandler.onShowAllValues(property, filterText);
                                          } }
        />;
    }

    let filterTreeItem = <CustomTreeItem itemId={property.title+"-filter"}
                                         label={<FacetFilter eventHandler={prop.eventHandler}
                                                             numberOfValues={prop.propertyValueCount?.values.length}
                                                             property={prop.propertyValueCount?.property}
                                                             textFilters={prop.textFilters}
                                         />}
    />;

    return <CustomTreeItem key={property.title}
                           itemId={Tools.createItemIdForProperty(property)}
                           label={<FacetWithCount displayTitle={property.displayTitle} count={prop.facetCount?.count ?? 0} />}
                           action={onPropertyActionClick}
                           actionIcon={propertyActionIcon}>
        {filterTreeItem}
        {lastRangeTreeItem}
        {facetValues}
        {showAllTreeItem}
    </CustomTreeItem>
}
 export default SelectedFacet;