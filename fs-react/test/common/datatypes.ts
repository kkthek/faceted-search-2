import {CategoryNode} from "../../src/common/datatypes";

const assert = require('assert');
const util = require('util')

const visitNode= (node: CategoryNode, callback: (node: CategoryNode) => void) => {
    callback(node);
    node.children.forEach((node) => {
        visitNode(node, callback)
    });
}

const log = (obj: unknown) => console.log(util.inspect(obj, {showHidden: false, depth: null, colors: true}));
describe('datatypes', function () {
    it('test node filtering', function () {

        let node = new CategoryNode('A', [
            new CategoryNode('AA', [
                new CategoryNode('AAA', []),
            ]), new CategoryNode('AB', [
                new CategoryNode('ABA', [
                    new CategoryNode('ABAA', []),
                ]),
            ])
        ]).createParentReferences();

        let filteredTree = node.filterForText('ABA');
        log(filteredTree);

        let nodes = [];
        visitNode(filteredTree, (node) => nodes.push(node.category));
        log(nodes);

        assert.deepEqual(nodes, [ 'A', 'AB', 'ABA', 'ABAA' ]);

    });
});

describe('datatypes', function () {
    it('test node item ids', function () {

        let node = new CategoryNode('A', [
            new CategoryNode('AA', [
                new CategoryNode('AAA', []),
            ]), new CategoryNode('AB', [
                new CategoryNode('ABA', [
                    new CategoryNode('ABAA', []),
                ]),
            ])
        ]).createParentReferences();

        let itemIds = node.getNodeItemIds(node);
        log(itemIds);
        assert.deepEqual(itemIds, [
            'AAA',     'ABA',
            'A',       'AAAAA',
            'AAA',     'AAAAA',
            'ABAAB',   'ABA',
            'ABAAABA', 'ABAAB',
            'ABAAABA'
        ]);

    });
});
