import {expect} from "chai";
import {Property} from "../../../src/common/property";
import {PropertyFacet} from "../../../src/common/request/property_facet";
import {Datatype} from "../../../src/common/datatypes";
import {FacetValue} from '../../../src/common/request/facet_value';
import {MWTitle} from '../../../src/common/mw_title';
import {Range} from '../../../src/common/range';

describe('PropertyFacet', () => {

    const stringProperty = new Property('StringProp', Datatype.string);
    const numberProperty = new Property('NumberProp', Datatype.number);
    const dateProperty = new Property('DateProp', Datatype.datetime);

    describe('constructor', () => {

        it('should create a PropertyFacet with property and values', () => {
            const value = new FacetValue('testValue', null, null);
            const facet = new PropertyFacet(stringProperty, [value]);

            expect(facet.property).to.deep.equal(stringProperty);
            expect(facet.values).to.have.lengthOf(1);
            expect(facet.values[0]).to.equal(value);
        });

        it('should create a PropertyFacet with empty values', () => {
            const facet = new PropertyFacet(stringProperty, []);

            expect(facet.property).to.deep.equal(stringProperty);
            expect(facet.values).to.have.lengthOf(0);
        });

        it('should create a PropertyFacet with multiple values', () => {
            const value1 = new FacetValue('val1', null, null);
            const value2 = new FacetValue('val2', null, null);
            const facet = new PropertyFacet(stringProperty, [value1, value2]);

            expect(facet.values).to.have.lengthOf(2);
        });
    });

    describe('containsFacet', () => {

        it('should return true when facet contains matching value', () => {
            const value = new FacetValue('testValue', null, null);
            const facet = new PropertyFacet(stringProperty, [value]);

            const searchValue = new FacetValue('testValue', null, null);
            expect(facet.containsFacet(searchValue)).to.be.true;
        });

        it('should return false when facet does not contain matching value', () => {
            const value = new FacetValue('testValue', null, null);
            const facet = new PropertyFacet(stringProperty, [value]);

            const searchValue = new FacetValue('otherValue', null, null);
            expect(facet.containsFacet(searchValue)).to.be.false;
        });

        it('should return false for null value', () => {
            const value = new FacetValue('testValue', null, null);
            const facet = new PropertyFacet(stringProperty, [value]);

            expect(facet.containsFacet(null)).to.be.false;
        });

        it('should return true when value is within a range', () => {
            const range =new Range(10, 50);
            const facetValue = new FacetValue(null, null, range);
            const facet = new PropertyFacet(numberProperty, [facetValue]);

            const searchRange = new Range(0, 100);
            const searchValue = new FacetValue(null, null, searchRange);
            expect(facet.containsFacet(searchValue)).to.be.true;
        });

        it('should return true with multiple values when one matches', () => {
            const value1 = new FacetValue('val1', null, null);
            const value2 = new FacetValue('val2', null, null);
            const facet = new PropertyFacet(stringProperty, [value1, value2]);

            const searchValue = new FacetValue('val2', null, null);
            expect(facet.containsFacet(searchValue)).to.be.true;
        });

        it('should return false when facet has no values', () => {
            const facet = new PropertyFacet(stringProperty, []);
            const searchValue = new FacetValue('testValue', null, null);
            expect(facet.containsFacet(searchValue)).to.be.false;
        });
    });

    describe('hasValueOrMWTitle', () => {

        it('should return true when a value exists', () => {
            const value = new FacetValue('testValue', null, null);
            const facet = new PropertyFacet(stringProperty, [value]);

            expect(facet.hasValueOrMWTitle()).to.be.true;
        });

        it('should return true when an MWTitle exists', () => {
            const mwTitle = new MWTitle('TestPage', 'TestPage-Display');
            const value = new FacetValue(null, mwTitle, null);
            const facet = new PropertyFacet(stringProperty, [value]);

            expect(facet.hasValueOrMWTitle()).to.be.true;
        });

        it('should return false when only range exists', () => {
            const range = new Range(0, 100);
            const value = new FacetValue(null, null, range);
            const facet = new PropertyFacet(numberProperty, [value]);

            expect(facet.hasValueOrMWTitle()).to.be.false;
        });

        it('should return false when all values are null', () => {
            const value = new FacetValue(null, null, null);
            const facet = new PropertyFacet(stringProperty, [value]);

            expect(facet.hasValueOrMWTitle()).to.be.false;
        });

        it('should return true if at least one value has value or mwTitle', () => {
            const value1 = new FacetValue(null, null, null);
            const value2 = new FacetValue('testValue', null, null);
            const facet = new PropertyFacet(stringProperty, [value1, value2]);

            expect(facet.hasValueOrMWTitle()).to.be.true;
        });

        it('should return false for empty values array', () => {
            const facet = new PropertyFacet(stringProperty, []);
            expect(facet.hasValueOrMWTitle()).to.be.false;
        });
    });

    describe('hasRange', () => {

        it('should return true when a range exists', () => {
            const range = new Range(0, 100);
            const value = new FacetValue(null, null, range);
            const facet = new PropertyFacet(numberProperty, [value]);

            expect(facet.hasRange()).to.be.true;
        });

        it('should return false when no range exists', () => {
            const value = new FacetValue('testValue', null, null);
            const facet = new PropertyFacet(stringProperty, [value]);

            expect(facet.hasRange()).to.be.false;
        });

        it('should return true if at least one value has a range', () => {
            const value1 = new FacetValue('testValue', null, null);
            const range = new Range(0, 100);
            const value2 = new FacetValue(null, null, range);
            const facet = new PropertyFacet(numberProperty, [value1, value2]);

            expect(facet.hasRange()).to.be.true;
        });

        it('should return false for empty values array', () => {
            const facet = new PropertyFacet(numberProperty, []);
            expect(facet.hasRange()).to.be.false;
        });
    });

    describe('getProperty', () => {

        it('should return the property', () => {
            const facet = new PropertyFacet(stringProperty, []);
            expect(facet.getProperty()).to.equal(stringProperty);
        });
    });

    describe('facetForAnyValue', () => {

        it('should create a facet with a single FacetValue with all null fields', () => {
            const facet = PropertyFacet.facetForAnyValue(stringProperty);

            expect(facet.property).to.deep.equal(stringProperty);
            expect(facet.values).to.have.lengthOf(1);
            expect(facet.values[0].value).to.be.null;
            expect(facet.values[0].mwTitle).to.be.null;
            expect(facet.values[0].range).to.be.null;
        });

        it('should preserve the property type', () => {
            const facet = PropertyFacet.facetForAnyValue(numberProperty);
            expect(facet.property.type).to.equal(Datatype.number);
        });
    });

    describe('equals', () => {

        it('should return false for facets with different properties', () => {
            const value = new FacetValue('testValue', null, null);
            const facet1 = new PropertyFacet(stringProperty, [value]);
            const otherProperty = new Property('OtherProp', Datatype.string);
            const facet2 = new PropertyFacet(otherProperty, [value]);

            expect(facet1.equals(facet2)).to.be.false;
        });

        it('should return false for facets with different values', () => {
            const value1 = new FacetValue('val1', null, null);
            const value2 = new FacetValue('val2', null, null);
            const facet1 = new PropertyFacet(stringProperty, [value1]);
            const facet2 = new PropertyFacet(stringProperty, [value2]);

            expect(facet1.equals(facet2)).to.be.false;
        });

        it('should return true for facets with same values in different order', () => {
            const value1 = new FacetValue('val1', null, null);
            const value2 = new FacetValue('val2', null, null);
            const facet1 = new PropertyFacet(stringProperty, [value1, value2]);
            const facet2 = new PropertyFacet(stringProperty, [value2, value1]);

            expect(facet1.equals(facet2)).to.be.true;
        });

        it('should return true for both empty value arrays', () => {
            const facet1 = new PropertyFacet(stringProperty, []);
            const facet2 = new PropertyFacet(stringProperty, []);

            expect(facet1.equals(facet2)).to.be.true;
        });
    });

    describe('equalsOrWithinRange', () => {

        it('should return true for equal facets with same values', () => {
            const value = new FacetValue('testValue', null, null);
            const facet1 = new PropertyFacet(stringProperty, [value]);
            const facet2 = new PropertyFacet(stringProperty, [value]);

            expect(facet1.equals(facet2)).to.be.true;
        });

        it('should return false for facets with different number of values', () => {
            const value1 = new FacetValue('val1', null, null);
            const value2 = new FacetValue('val2', null, null);
            const facet1 = new PropertyFacet(stringProperty, [value1]);
            const facet2 = new PropertyFacet(stringProperty, [value1, value2]);

            expect(facet1.equals(facet2)).to.be.false;
        });

        it('should return true when range is within the other range', () => {
            const outerRange = new Range(0, 100);
            const innerRange = new Range(10, 50);
            const value1 = new FacetValue(null, null, innerRange);
            const value2 = new FacetValue(null, null, outerRange);
            const facet1 = new PropertyFacet(numberProperty, [value1]);
            const facet2 = new PropertyFacet(numberProperty, [value2]);

            expect(facet1.withinRange(facet2)).to.be.true;
        });

        it('should return true for equal ranges', () => {
            const range1 = new Range(0, 100);
            const range2 = new Range(0, 100);
            const value1 = new FacetValue(null, null, range1);
            const value2 = new FacetValue(null, null, range2);
            const facet1 = new PropertyFacet(numberProperty, [value1]);
            const facet2 = new PropertyFacet(numberProperty, [value2]);

            expect(facet1.withinRange(facet2)).to.be.true;
        });

        it('should return true for both empty value arrays', () => {
            const facet1 = new PropertyFacet(stringProperty, []);
            const facet2 = new PropertyFacet(stringProperty, []);

            expect(facet1.equals(facet2)).to.be.true;
        });

        it('should return false when range is outside the other range', () => {
            const range1 = new Range(0, 50);
            const range2 = new Range(60, 100);
            const value1 = new FacetValue(null, null, range1);
            const value2 = new FacetValue(null, null, range2);
            const facet1 = new PropertyFacet(numberProperty, [value1]);
            const facet2 = new PropertyFacet(numberProperty, [value2]);

            expect(facet1.withinRange(facet2)).to.be.false;
        });
    });
});