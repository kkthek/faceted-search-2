import React, {useContext} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ChecklistIcon from "@mui/icons-material/Checklist";
import {PropertyValueCount} from "app/common/response/property_value_count";
import {SearchStateFacet} from "app/common/datatypes";
import {PropertyFacetCount} from "app/common/response/property_facet_count";
import EventHandler from "app/common/event_handler";
import {Property} from "app/common/property";
import {WikiContext} from "app/index";
import SelectedFacetValues from "app/ui/facets/selected_facet_values_view";
import CustomTreeItem from "app/custom_ui/custom_tree_item";
import IdTools from "app/util/id_tools";
import Span from "app/custom_ui/span";
import ShowAllButton from "app/ui/facets/show_all_button";
import FacetFilter from "app/ui/facets/facet_filter";
import FacetWithCount from "app/ui/common/facet_with_count";
import {Range} from "app/common/range";

function SelectedFacet(prop: {
    propertyValueCount: PropertyValueCount
    searchStateFacets: SearchStateFacet,
    facetCount: PropertyFacetCount
    searchStateFacet: SearchStateFacet,
    eventHandler: EventHandler
    onOrDialogClick: (property: Property) => void

}) {
    const query = prop.searchStateFacet.query;
    const property = prop.propertyValueCount.property;
    const propertyFacet = query.findPropertyFacet(property);
    if (!propertyFacet) return;
    const isRemovable = !propertyFacet.hasValueOrMWTitle() || propertyFacet.hasRange();
    const wikiContext = useContext(WikiContext);
    const facetsWithOr = wikiContext.config['fs2gFacetsWithOR'].includes(property.title);

    const facetValues = prop.propertyValueCount.values
        .sort((a, b) => a.compareToSelectedFirst(b, propertyFacet))
        .map((v,i ) => {

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
        const lastConstraint = propertyFacet.values[propertyFacet.values.length - 1];
        if (lastConstraint && !lastConstraint.isEmpty()) {
            const r = lastConstraint.range as Range;
            lastRangeTreeItem = <CustomTreeItem key={property.title+'_lastRange'}
                                                itemId={IdTools.createItemIdForProperty(property)+'_lastRange'}
                                                label={<Span color={"secondary"}>{r.displayRange(wikiContext)}</Span>}
                                                action={()=>prop.eventHandler.onRemovePropertyFacet(propertyFacet, lastConstraint)}
                                                actionIcon={DeleteIcon}
            />;
        }
    }

    let showAllTreeItem;
    const showAll = prop.propertyValueCount?.values.length === wikiContext.config.fs2gFacetValueLimit &&
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
                                                             numberOfValues={prop.propertyValueCount?.values.length}
                                                             property={prop.propertyValueCount?.property}

                                         />}
    />;

    return <CustomTreeItem key={property.title}
                           itemId={IdTools.createItemIdForProperty(property)}
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