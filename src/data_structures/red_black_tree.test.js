import RedBlackTree from './red_black_tree';
import { RBTNode } from './red_black_tree';

// This file contains tests specific to RedBlackTree
// RedBlackTree is also covered by the generic
// BST tests in binary_search_tree.test.js

describe(RedBlackTree, () => {
  let rbTree;
  beforeEach(() => {
    rbTree = new RedBlackTree();
  });

  const rbTreeIntrospect = (tree, callback) => {
    // Similar to the builtin forEach function. Differences:
    // - Invokes the callback on the node instead of just the k/v pair
    // - Tracks the blackDepth (number of black nodes betweeen
    //     it and the root, inclusive) of each visited node
    const visit = (node, callback, i = 0, blackDepth = 0) => {
      if (node.color === RBTNode.BLACK) {
        blackDepth += 1;
      }

      if (node?.left) {
        i = visit(node.left, callback, i, blackDepth);
      }

      callback(node, i, blackDepth, tree);

      if (node?.right) {
        i = visit(node.right, callback, i + 1, blackDepth);
      }

      return i;
    }
    visit(tree._root, callback);
  }

  /* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "verifyRbTreeProperties"] }] */
  const verifyRbTreeProperties = (tree, debug = false) => {
    const log = (...args) => {
      if (debug) {
        console.log(args);
      }
    }
    // Property numbers come from
    // _Introduction to Algorithms_, by Cormen et. al.

    if (!tree._root) {
      return;
    }

    // 2. The root is black
    expect(tree._root.color).toBe(RBTNode.BLACK);

    const leafBlackDepths = [];

    rbTreeIntrospect(tree, (node, _, blackDepth) => {
      log(`Visiting node with key ${node.key}, color ${node.color}, blackDepth ${node.blackDepth}`);

      // 1. Every node is either red or black
      expect([RBTNode.RED, RBTNode.BLACK]).toContain(node.color);

      // leaf nodes
      if (!node.key) {
        // 3. All leaf nodes are black (because they're the sentinel)
        expect(node.color).toBe(RBTNode.BLACK);

        leafBlackDepths.push(blackDepth);
      }

      // 4. If a node is red, then both of its children are black
      if (node.color === RBTNode.RED) {
        expect(node.left.color).toBe(RBTNode.BLACK);
        expect(node.right.color).toBe(RBTNode.BLACK);
      }
    });

    const errorMessage = `Expected the black-depth of all sentinel leaves to be the same, instead got ${JSON.stringify(leafBlackDepths)}`;
    leafBlackDepths.forEach(depth => {
      expect(depth, errorMessage).toBe(leafBlackDepths[0]);
    });
  }

  it('maintains properties on an empty tree', () => {
    verifyRbTreeProperties(rbTree);
  });

  it('maintains properties after one insert', () => {
    rbTree.insert('test');
    verifyRbTreeProperties(rbTree);
  });

  it('maintains properties after many inserts in random order', () => {
    const keys = ['one', 'two', 'three', 'four', 'five'];
    keys.forEach(key => rbTree.insert(key));
    verifyRbTreeProperties(rbTree);
  });

  it('maintains properties after many inserts in order', () => {
    const keys = ['one', 'two', 'three', 'four', 'five'].sort();
    keys.forEach(key => rbTree.insert(key));
    verifyRbTreeProperties(rbTree);
  });

  it('maintains properties after many inserts in reverse order', () => {
    const keys = ['one', 'two', 'three', 'four', 'five'].sort().reverse();
    keys.forEach(key => rbTree.insert(key));
    verifyRbTreeProperties(rbTree);
  });

  describe('rotations', () => {
    let treeStructure;
    let treeStructureCopy; // shallow copy, no back links

    const fillStructure = (node, parent) => {
      if (node.left) {
        fillStructure(node.left, node);
      } else {
        node.left = RBTNode.sentinel;
      }
      if (node.right) {
        fillStructure(node.right, node);
      } else {
        node.right = RBTNode.sentinel;
      }
      node.parent = parent;
    }

    beforeEach(() => {
      treeStructure = {
        key: 'd',
        left: {
          key: 'b',
          left: { key: 'a' },
          right: { key: 'c' },
        },
        right: {
          key: 'f',
          left: { key: 'e' },
          right: { key: 'g' },
        },
      };
      treeStructureCopy = JSON.parse(JSON.stringify(treeStructure));
      fillStructure(treeStructure, RBTNode.sentinel);
    });


    // TODO what the fuck what even is this who am i
    const checkEqualStructure = (oak, pine) => {
      const oakStack = [oak];
      const pineStack = [pine];

      while (something) {
        oakNode = oak.pop();
        pineNode = pine.pop();

        while (oakNode.left?.key && pineNode.left?.key) {
          oakStack.push(oakNode);
          oakNode = oakNode.left;
          pineStack.push(pineNode);
          pineNode = pineNode.left;
        }

        expect(oakNode.key).toBe(pineNode.key);


      }
    }
  });
});