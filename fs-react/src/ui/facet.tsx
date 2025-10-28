import React, {useContext, useRef} from "react";
import {FacetResponse, Property, PropertyFacetCount} from "../common/datatypes";
import Tools from "../util/tools";
import FacetValues from "./facet_values_view";
import EventHandler, {SearchStateDocument} from "../common/event_handler";
import {WikiContext} from "../index";
import CustomTreeItem from "../custom_ui/custom_tree_item";
import ChecklistIcon from '@mui/icons-material/Checklist';
import FacetFilter from "./facet_filter";
import FacetWithCount from "./facet_with_count";


function FacetViewProperty(prop: {
    searchStateDocument: SearchStateDocument,
    searchStateFacets: FacetResponse,
    propertyFacetCount: PropertyFacetCount,
    eventHandler: EventHandler
    onOrDialogClick: (property: Property) => void
}) {

    const inputFilterRef = useRef<any>();
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
                                          label={"[" + wikiContext.msg('fs-show-all') + "]"}
                                          itemAction={() => {
                                              const filterText = inputFilterRef.current.value as string;
                                              prop.eventHandler.onShowAllValues(property, filterText);
                                          }}
        />;
    }

    let filterTreeItem = <CustomTreeItem itemId={property.title+"-filter"}
                                         label={<FacetFilter eventHandler={prop.eventHandler}
                                                             numberOfValues={propertyValueCount?.values.length}
                                                             property={propertyValueCount?.property}
                                                             inputFilterRef={inputFilterRef}
                                         />}
    />;

    return <CustomTreeItem itemId={Tools.createItemIdForProperty(property)}
                           label={<FacetWithCount displayTitle={property.displayTitle} count={prop.propertyFacetCount?.count}/>}
                           itemAction={() => prop.eventHandler.onPropertyClick(property)}
                           actionIcon={facetsWithOr ? ChecklistIcon : null}
                           action={() => prop.onOrDialogClick(property)}
                           className={'fs-facets'}>
        {filterTreeItem}
        {facetTreeItems}
        {showAllTreeItem}

    </CustomTreeItem>
}

export default FacetViewProperty;