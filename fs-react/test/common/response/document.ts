import {expect} from 'chai';
import '../../../src/util/array_ext';
import {Document} from '../../../src/common/response/document';
import {PropertyFacetValues} from '../../../src/common/response/property_facet_values';
import {CategoryFacetValue} from '../../../src/common/response/category_facet_value';
import {PropertyWithURL} from '../../../src/common/response/property_with_URL';
import {Datatype} from "../../../src/common/datatypes";

function makePropertyFacetValues(propertyTitle: string, type: Datatype, values: any[]): PropertyFacetValues {
    const pfv = new PropertyFacetValues();
    pfv.property = new PropertyWithURL(propertyTitle, type);
    pfv.values = values;
    return pfv;
}

function makeCategoryFacetValue(category: string): CategoryFacetValue {
    const cfv = new CategoryFacetValue();
    cfv.category = category;
    cfv.displayTitle = category;
    cfv.url = '/wiki/' + category;
    return cfv;
}

function makeDocument(
    propertyFacets: PropertyFacetValues[] = [],
    categoryFacets: CategoryFacetValue[] = []
): Document {
    const doc = new Document();
    doc.id = 'test-doc';
    doc.title = 'Test Document';
    doc.propertyFacets = propertyFacets;
    doc.categoryFacets = categoryFacets;
    return doc;
}

describe('Document', () => {

    describe('getPropertyFacetValues', () => {

        it('should return the PropertyFacetValues matching the given property title', () => {
            const pfv = makePropertyFacetValues('Color', Datatype.string, ['red', 'blue']);
            const doc = makeDocument([pfv]);

            const result = doc.getPropertyFacetValues('Color');

            expect(result).to.equal(pfv);
        });

        it('should return null when no property facet matches', () => {
            const pfv = makePropertyFacetValues('Color', Datatype.string,['red']);
            const doc = makeDocument([pfv]);

            const result = doc.getPropertyFacetValues('NonExistent');

            expect(result).to.be.null;
        });

        it('should return the first match when multiple property facets exist', () => {
            const pfv1 = makePropertyFacetValues('Color', Datatype.string,['red']);
            const pfv2 = makePropertyFacetValues('Size', Datatype.string,['large']);
            const doc = makeDocument([pfv1, pfv2]);

            expect(doc.getPropertyFacetValues('Color')).to.equal(pfv1);
            expect(doc.getPropertyFacetValues('Size')).to.equal(pfv2);
        });

        it('should return null when propertyFacets is empty', () => {
            const doc = makeDocument([]);

            const result = doc.getPropertyFacetValues('Anything');

            expect(result).to.be.null;
        });
    });

    describe('getCategoryFacetValue', () => {

        it('should return the CategoryFacetValue matching the given category', () => {
            const cfv = makeCategoryFacetValue('Science');
            const doc = makeDocument([], [cfv]);

            const result = doc.getCategoryFacetValue('Science');

            expect(result).to.equal(cfv);
        });

        it('should return null when no category facet matches', () => {
            const cfv = makeCategoryFacetValue('Science');
            const doc = makeDocument([], [cfv]);

            const result = doc.getCategoryFacetValue('Art');

            expect(result).to.be.null;
        });

        it('should return null when categoryFacets is empty', () => {
            const doc = makeDocument([], []);

            const result = doc.getCategoryFacetValue('Anything');

            expect(result).to.be.null;
        });

        it('should find the correct category among multiple facets', () => {
            const cfv1 = makeCategoryFacetValue('Science');
            const cfv2 = makeCategoryFacetValue('Art');
            const doc = makeDocument([], [cfv1, cfv2]);

            expect(doc.getCategoryFacetValue('Art')).to.equal(cfv2);
        });
    });

    describe('containsFacetValue', () => {

        it('should return true when the string value exists in the property facet', () => {
            const pfv = makePropertyFacetValues('Color', Datatype.string,['red', 'blue', 'green']);
            const doc = makeDocument([pfv]);

            expect(doc.containsFacetValue('Color', 'blue')).to.be.true;
        });

        it('should return false when the string value does not exist in the property facet', () => {
            const pfv = makePropertyFacetValues('Color', Datatype.string,['red', 'blue']);
            const doc = makeDocument([pfv]);

            expect(doc.containsFacetValue('Color', 'yellow')).to.be.false;
        });

        it('should return false when the property does not exist', () => {
            const doc = makeDocument([]);

            expect(doc.containsFacetValue('NonExistent', 'value')).to.be.false;
        });

        it('should return true when a numeric value exists in the property facet', () => {
            const pfv = makePropertyFacetValues('Score', Datatype.number, [10, 20, 30]);
            const doc = makeDocument([pfv]);

            expect(doc.containsFacetValue('Score', 20)).to.be.true;
        });

        it('should return false when a numeric value does not exist in the property facet', () => {
            const pfv = makePropertyFacetValues('Score',Datatype.number, [10, 20, 30]);
            const doc = makeDocument([pfv]);

            expect(doc.containsFacetValue('Score', 99)).to.be.false;
        });

        it('should return true when a boolean value exists in the property facet', () => {
            const pfv = makePropertyFacetValues('Active',Datatype.boolean, [true, false]);
            const doc = makeDocument([pfv]);

            expect(doc.containsFacetValue('Active', true)).to.be.true;
        });

        it('should return true when a Date value matches by time', () => {
            const date1 = new Date('2024-01-15T00:00:00Z');
            const date2 = new Date('2024-06-20T00:00:00Z');
            const pfv = makePropertyFacetValues('Created',Datatype.datetime, [date1, date2]);
            const doc = makeDocument([pfv]);

            const searchDate = new Date('2024-06-20T00:00:00Z');
            expect(doc.containsFacetValue('Created', searchDate)).to.be.true;
        });

        it('should return false when a Date value does not match by time', () => {
            const date1 = new Date('2024-01-15T00:00:00Z');
            const pfv = makePropertyFacetValues('Created',Datatype.datetime, [date1]);
            const doc = makeDocument([pfv]);

            const searchDate = new Date('2025-01-01T00:00:00Z');
            expect(doc.containsFacetValue('Created', searchDate)).to.be.false;
        });

        it('should return false when the property facet has empty values', () => {
            const pfv = makePropertyFacetValues('Color', Datatype.string, []);
            const doc = makeDocument([pfv]);

            expect(doc.containsFacetValue('Color', 'red')).to.be.false;
        });
    });
});