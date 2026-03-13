import {expect} from 'chai';
import {FacetValue} from '../../../src/common/request/facet_value';
import {MWTitle} from '../../../src/common/mw_title';
import {Range} from '../../../src/common/range';
import {ValueCount} from '../../../src/common/response/value_count';
import {MWTitleWithURL} from "../../../src/common/response/mw_title_with_URL";

describe('FacetValue', () => {

    describe('constructor', () => {
        it('should set value, mwTitle, and range', () => {
            const mwTitle = new MWTitle('Test', 'Test Display');
            const range = new Range(1, 10);
            const fv = new FacetValue('hello', mwTitle, range);

            expect(fv.value).to.equal('hello');
            expect(fv.mwTitle).to.equal(mwTitle);
            expect(fv.range).to.equal(range);
        });

        it('should allow null/undefined values', () => {
            const fv = new FacetValue(null, null, null);
            expect(fv.value).to.be.null;
            expect(fv.mwTitle).to.be.null;
            expect(fv.range).to.be.null;
        });
    });

    describe('isEmpty', () => {
        it('should return true when all fields are null', () => {
            const fv = new FacetValue(null, null, null);
            expect(fv.isEmpty()).to.be.true;
        });

        it('should return true when all fields are undefined', () => {
            const fv = new FacetValue(undefined, undefined, undefined);
            expect(fv.isEmpty()).to.be.true;
        });

        it('should return false when value is set', () => {
            const fv = new FacetValue('hello', null, null);
            expect(fv.isEmpty()).to.be.false;
        });

        it('should return false when mwTitle is set', () => {
            const fv = new FacetValue(null, new MWTitle('Test', 'Test'), null);
            expect(fv.isEmpty()).to.be.false;
        });

        it('should return false when range is set', () => {
            const fv = new FacetValue(null, null, new Range(1, 10));
            expect(fv.isEmpty()).to.be.false;
        });

        it('should return false when all fields are set', () => {
            const fv = new FacetValue('val', new MWTitle('T', 'T'), new Range(0, 5));
            expect(fv.isEmpty()).to.be.false;
        });
    });

    describe('static factory methods', () => {
        describe('fromValue', () => {
            it('should create FacetValue with only value set', () => {
                const fv = FacetValue.fromValue('test');
                expect(fv.value).to.equal('test');
                expect(fv.mwTitle).to.be.null;
                expect(fv.range).to.be.null;
            });

            it('should work with number value', () => {
                const fv = FacetValue.fromValue(42);
                expect(fv.value).to.equal(42);
            });

            it('should work with boolean value', () => {
                const fv = FacetValue.fromValue(true);
                expect(fv.value).to.equal(true);
            });

            it('should work with Date value', () => {
                const date = new Date('2025-01-01');
                const fv = FacetValue.fromValue(date);
                expect(fv.value).to.equal(date);
            });
        });

        describe('fromMWTitle', () => {
            it('should create FacetValue with only mwTitle set', () => {
                const title = new MWTitle('Page', 'Page Display');
                const fv = FacetValue.fromMWTitle(title);
                expect(fv.value).to.be.null;
                expect(fv.mwTitle).to.equal(title);
                expect(fv.range).to.be.null;
            });
        });

        describe('fromRange', () => {
            it('should create FacetValue with only range set', () => {
                const range = new Range(5, 15);
                const fv = FacetValue.fromRange(range);
                expect(fv.value).to.be.null;
                expect(fv.mwTitle).to.be.null;
                expect(fv.range).to.equal(range);
            });
        });

        describe('fromValueCount', () => {
            it('should create FacetValue from ValueCount object', () => {
                const vc = new ValueCount();
                vc.value = 'test';
                vc.mwTitle = new MWTitleWithURL('Page', 'Page', '');
                vc.range = new Range(1, 10);

                const fv = FacetValue.fromValueCount(vc);
                expect(fv.value).to.equal(vc.value);
                expect(fv.mwTitle).to.equal(vc.mwTitle);
                expect(fv.range).to.equal(vc.range);
            });
        });
    });

    describe('equals', () => {
        it('should return true for two empty FacetValues', () => {
            const a = new FacetValue(null, null, null);
            const b = new FacetValue(null, null, null);
            expect(a.equals(b)).to.be.true;
        });

        it('should return true for same string values', () => {
            const a = FacetValue.fromValue('hello');
            const b = FacetValue.fromValue('hello');
            expect(a.equals(b)).to.be.true;
        });

        it('should return false for different string values', () => {
            const a = FacetValue.fromValue('hello');
            const b = FacetValue.fromValue('world');
            expect(a.equals(b)).to.be.false;
        });

        it('should return true for same number values', () => {
            const a = FacetValue.fromValue(42);
            const b = FacetValue.fromValue(42);
            expect(a.equals(b)).to.be.true;
        });

        it('should return false for different number values', () => {
            const a = FacetValue.fromValue(42);
            const b = FacetValue.fromValue(99);
            expect(a.equals(b)).to.be.false;
        });

        it('should return true for same boolean values', () => {
            const a = FacetValue.fromValue(true);
            const b = FacetValue.fromValue(true);
            expect(a.equals(b)).to.be.true;
        });

        it('should return false for different boolean values', () => {
            const a = FacetValue.fromValue(true);
            const b = FacetValue.fromValue(false);
            expect(a.equals(b)).to.be.false;
        });

        it('should return true for same Date values', () => {
            const a = FacetValue.fromValue(new Date('2025-06-15'));
            const b = FacetValue.fromValue(new Date('2025-06-15'));
            expect(a.equals(b)).to.be.true;
        });

        it('should return false for different Date values', () => {
            const a = FacetValue.fromValue(new Date('2025-06-15'));
            const b = FacetValue.fromValue(new Date('2025-01-01'));
            expect(a.equals(b)).to.be.false;
        });

        it('should return true for equal MWTitles', () => {
            const a = FacetValue.fromMWTitle(new MWTitle('Page', 'Page'));
            const b = FacetValue.fromMWTitle(new MWTitle('Page', 'Page'));
            expect(a.equals(b)).to.be.true;
        });

        it('should return false for different MWTitles', () => {
            const a = FacetValue.fromMWTitle(new MWTitle('Page1', 'Page1'));
            const b = FacetValue.fromMWTitle(new MWTitle('Page2', 'Page2'));
            expect(a.equals(b)).to.be.false;
        });

        it('should return true for equal Ranges', () => {
            const a = FacetValue.fromRange(new Range(1, 10));
            const b = FacetValue.fromRange(new Range(1, 10));
            expect(a.equals(b)).to.be.true;
        });

        it('should return false for different Ranges', () => {
            const a = FacetValue.fromRange(new Range(1, 10));
            const b = FacetValue.fromRange(new Range(5, 20));
            expect(a.equals(b)).to.be.false;
        });

        it('should return false when one has value and other has mwTitle', () => {
            const a = FacetValue.fromValue('test');
            const b = FacetValue.fromMWTitle(new MWTitle('test', 'test'));
            expect(a.equals(b)).to.be.false;
        });

        it('should return false when one has value and other has range', () => {
            const a = FacetValue.fromValue('test');
            const b = FacetValue.fromRange(new Range(1, 10));
            expect(a.equals(b)).to.be.false;
        });
    });

    describe('equalsOrWithinRange', () => {
        it('should return true when ranges are identical', () => {
            const a = FacetValue.fromRange(new Range(1, 10));
            const b = FacetValue.fromRange(new Range(1, 10));
            expect(a.equalsOrWithinRange(b)).to.be.true;
        });

        it('should return true when this range is within that range', () => {
            const a = FacetValue.fromRange(new Range(3, 7));
            const b = FacetValue.fromRange(new Range(1, 10));
            expect(a.equalsOrWithinRange(b)).to.be.true;
        });

        it('should still compare values correctly', () => {
            const a = FacetValue.fromValue('hello');
            const b = FacetValue.fromValue('hello');
            expect(a.equalsOrWithinRange(b)).to.be.true;
        });

        it('should return true when both ranges are null', () => {
            const a = FacetValue.fromValue('val');
            const b = FacetValue.fromValue('val');
            expect(a.equalsOrWithinRange(b)).to.be.true;
        });
    });

    describe('containsValueOrMWTitle', () => {
        it('should return true when value matches', () => {
            const fv = FacetValue.fromValue('hello');
            expect(fv.containsValueOrMWTitle('hello', undefined)).to.be.true;
        });

        it('should return true when mwTitle matches', () => {
            const title = new MWTitle('Page', 'Page');
            const fv = FacetValue.fromMWTitle(title);
            expect(fv.containsValueOrMWTitle(undefined, new MWTitle('Page', 'Page'))).to.be.true;
        });

        it('should return false when neither matches', () => {
            const fv = new FacetValue(null, null, new Range(1, 10));
            expect(fv.containsValueOrMWTitle('test', undefined)).to.be.false;
        });

        it('should return false when value does not match', () => {
            const fv = FacetValue.fromValue('hello');
            expect(fv.containsValueOrMWTitle('world', undefined)).to.be.false;
        });
    });

    describe('toString', () => {
        it('should return range string when range is set', () => {
            const range = new Range(1, 10);
            const fv = new FacetValue('ignored', new MWTitle('Also ignored', 'Also ignored'), range);
            expect(fv.toString()).to.equal(range.toString());
        });

        it('should return mwTitle title when mwTitle is set and range is not', () => {
            const fv = FacetValue.fromMWTitle(new MWTitle('MyPage', 'MyPage Display'));
            expect(fv.toString()).to.equal('MyPage');
        });

        it('should return string value when only value is set', () => {
            const fv = FacetValue.fromValue('some text');
            expect(fv.toString()).to.equal('some text');
        });

        it('should return number as string when value is number', () => {
            const fv = FacetValue.fromValue(42);
            expect(fv.toString()).to.equal('42');
        });
    });

    describe('sameValue (static)', () => {
        it('should return true for both null', () => {
            expect(FacetValue.sameValue(null, null)).to.be.true;
        });

        it('should return true for both undefined', () => {
            expect(FacetValue.sameValue(undefined, undefined)).to.be.true;
        });

        it('should return true for null and undefined', () => {
            expect(FacetValue.sameValue(null, undefined)).to.be.true;
        });

        it('should return false when one is null and other is a value', () => {
            expect(FacetValue.sameValue(null, 'test')).to.be.false;
        });

        it('should return false when one is undefined and other is a value', () => {
            expect(FacetValue.sameValue(undefined, 42)).to.be.false;
        });

        it('should return true for equal strings', () => {
            expect(FacetValue.sameValue('abc', 'abc')).to.be.true;
        });

        it('should return false for different strings', () => {
            expect(FacetValue.sameValue('abc', 'def')).to.be.false;
        });

        it('should return true for equal numbers', () => {
            expect(FacetValue.sameValue(5, 5)).to.be.true;
        });

        it('should return false for different numbers', () => {
            expect(FacetValue.sameValue(5, 10)).to.be.false;
        });

        it('should return true for equal booleans', () => {
            expect(FacetValue.sameValue(true, true)).to.be.true;
            expect(FacetValue.sameValue(false, false)).to.be.true;
        });

        it('should return false for different booleans', () => {
            expect(FacetValue.sameValue(true, false)).to.be.false;
        });

        it('should return true for same Date (by UTC string)', () => {
            const d1 = new Date('2025-06-15T00:00:00Z');
            const d2 = new Date('2025-06-15T00:00:00Z');
            expect(FacetValue.sameValue(d1, d2)).to.be.true;
        });

        it('should return false for different Dates', () => {
            const d1 = new Date('2025-06-15T00:00:00Z');
            const d2 = new Date('2025-07-20T00:00:00Z');
            expect(FacetValue.sameValue(d1, d2)).to.be.false;
        });
    });

    describe('sameMWTitle (static)', () => {
        it('should return true for both null', () => {
            expect(FacetValue.sameMWTitle(null, null)).to.be.true;
        });

        it('should return true for both undefined', () => {
            expect(FacetValue.sameMWTitle(undefined, undefined)).to.be.true;
        });

        it('should return false when one is null and other is defined', () => {
            expect(FacetValue.sameMWTitle(null, new MWTitle('A', 'A'))).to.be.false;
        });

        it('should return true for equal MWTitles', () => {
            expect(FacetValue.sameMWTitle(
                new MWTitle('Page', 'Page'),
                new MWTitle('Page', 'Page')
            )).to.be.true;
        });

        it('should return false for different MWTitles', () => {
            expect(FacetValue.sameMWTitle(
                new MWTitle('Page1', 'Page1'),
                new MWTitle('Page2', 'Page2')
            )).to.be.false;
        });
    });

    describe('sameRange (static)', () => {
        it('should return true for both null', () => {
            expect(FacetValue.sameRange(null, null)).to.be.true;
        });

        it('should return true for both undefined', () => {
            expect(FacetValue.sameRange(undefined, undefined)).to.be.true;
        });

        it('should return false when one is null and other is defined', () => {
            expect(FacetValue.sameRange(null, new Range(1, 10))).to.be.false;
        });

        it('should return true for equal Ranges', () => {
            expect(FacetValue.sameRange(new Range(1, 10), new Range(1, 10))).to.be.true;
        });

        it('should return false for different Ranges', () => {
            expect(FacetValue.sameRange(new Range(1, 10), new Range(5, 20))).to.be.false;
        });
    });

    describe('withinRange (static)', () => {
        it('should return true for both null', () => {
            expect(FacetValue.withinRange(null, null)).to.be.true;
        });

        it('should return true for both undefined', () => {
            expect(FacetValue.withinRange(undefined, undefined)).to.be.true;
        });

        it('should return false when one is null and other is defined', () => {
            expect(FacetValue.withinRange(null, new Range(1, 10))).to.be.false;
        });

        it('should return true when a is within b', () => {
            expect(FacetValue.withinRange(new Range(3, 7), new Range(1, 10))).to.be.true;
        });
    });
});