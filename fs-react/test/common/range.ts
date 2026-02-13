import {Range} from "../../src/common/range";

const assert = require('assert');
const util = require('util')
const log = (obj: unknown) => console.log(util.inspect(obj, {showHidden: false, depth: null, colors: true}));
describe('range date', function () {
    it('range equals', function () {

        const rangeInner = new Range(new Date(2024, 0, 1), new Date(2024, 0, 3));
        const rangeOuter = new Range(new Date(2024, 0, 1), new Date(2024, 0, 3));

        assert.ok(rangeInner.equals(rangeOuter));

    });
});

describe('range date', function () {
    it('range equalsWithin', function () {

        const rangeInner = new Range(new Date(2024, 4, 13), new Date(2024, 5, 7));
        const rangeOuter = new Range(new Date(2024, 0, 1), new Date(2025, 0, 3));

        assert.ok(rangeInner.withinRange(rangeOuter));

    });
});


describe('range number', function () {
    it('range equals', function () {

        const rangeInner = new Range(3,7);
        const rangeOuter = new Range(3,7);

        assert.ok(rangeInner.equals(rangeOuter));

    });
});

describe('range number', function () {
    it('range equalsWithin', function () {

        const rangeInner = new Range(3,7);
        const rangeOuter = new Range(0,15);

        assert.ok(rangeInner.withinRange(rangeOuter));

    });
});