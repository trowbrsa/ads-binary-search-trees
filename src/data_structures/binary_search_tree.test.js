import BinarySearchTree from './binary_search_tree';
import RedBlackTree from './red_black_tree';

// Note: RedBlackTrees also have specific tests
// in red_black_tree.test.js

const dataStructures = [
  BinarySearchTree,
  RedBlackTree,
];

dataStructures.forEach(TargetDS => {
  describe(TargetDS, () => {
    let bst;
    beforeEach(() => {
      bst = new TargetDS();
    });

    it('starts empty', () => {
      expect(bst.count()).toBe(0);
    });
  });
});