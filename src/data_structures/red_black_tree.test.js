import RedBlackTree from './red_black_tree';

// This file contains tests specific to RedBlackTree
// RedBlackTree is also covered by the generic
// BST tests in binary_search_tree.test.js

describe(RedBlackTree, () => {
  let rbTree;
  beforeEach(() => {
    rbTree = new RedBlackTree();
  });

  it('starts empty', () => {
    expect(rbTree.count()).toBe(0);
  });
});