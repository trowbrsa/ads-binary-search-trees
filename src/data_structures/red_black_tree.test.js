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

  describe.skip('RB properties', () => {

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

  });

  describe('rotations', () => {
    /**
     * Dear Reader,
     * 
     * The following is some of the jankiest, monkey-patchey-est code
     * I've ever had the displeasure of writing. While I believe that
     * the ends justify the means, I am in no way proud of what I've
     * done here today.
     * 
     * The basic idea is that, to test rotations, we need to have a tree
     * already in place. Since the whole point of RB Trees is to move nodes
     * around, we can't just insert a bunch and call it a day like we could
     * with a BST. So we mock up the internal node structure of the tree,
     * patch it in, call the rotate function, and see what it did.
     * 
     * Unfortunately there's a lot of extra overhead involved. In particular,
     * we have to build sentinel and parent links for the mock trees
     * before giving them to the RBTree class, and then unlink them before
     * comparing them to our expected results. This test suite practically
     * needs a test suite!
     * 
     * What's worse, writing trees in JSON doesn't make it visually obvious
     * that the structure is correct. You'll just have to trust that I
     * transcribed them correctly from pencil and paper.
     * 
     * "But wait" you say, pointing excitedly at chapter 9 of POODR, "rotation
     * isn't part of the RBTree's interface! You're breaking encapsulation,
     * writing brittle tests with high cost and low value."
     * 
     * If we were talking about a production data structure, you would be
     * spot on. We'd test the complete data structure for consistency,
     * benchmark it in known pathological conditions, and call it good.
     * However, this code is for education, which means it's provided to
     * the student-customer incomplete. Rotation is part of what students
     * are given, and that means we need high confidence that it works
     * independently of any other operation.
     * 
     * If you're a student, you can pretty much skip this bit.
     * If you're another instructor who has to maintain this... good luck.
     * 
     * Sincerely,
     * DPR
     */
    const mockTrees = Object.freeze({
      balanced: {
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
      },
      rightSpine: {
        key: 'a',
        right: {
          key: 'b',
          right: {
            key: 'c',
            right: { key: 'd' }
          }
        }
      },
      leftSpine: {
        key: 'a',
        left: {
          key: 'b',
          left: {
            key: 'c',
            left: { key: 'd' }
          }
        }
      }
    });

    const deepCopy = (obj) => {
      return JSON.parse(JSON.stringify(obj))
    }

    const linkTree = (tree) => {
      const linkNode = (node, parent) => {
        if (node.left && node.left !== RBTNode.sentinel) {
          linkNode(node.left, node);
        } else {
          node.left = RBTNode.sentinel;
        }

        if (node.right && node.right !== RBTNode.sentinel) {
          linkNode(node.right, node);
        } else {
          node.right = RBTNode.sentinel;
        }

        if (!node.parent) {
          node.parent = parent;
        }
        return node;
      }
      return linkNode(deepCopy(tree), RBTNode.sentinel);
    }

    /* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkTreeLinks", "checkEqualStructure"] }] */
    const checkTreeLinks = (tree) => {
      const visited = [];
      const checkNodeLinks = (node, parent = RBTNode.sentinel) => {
        visited.push(node);
        expect(node.parent).toBe(parent);

        if (node.left !== RBTNode.sentinel) {
          expect(node.left).toBeDefined();
          expect(visited).not.toContain(node.left);
          checkNodeLinks(node.left, node)
        }

        if (node.right !== RBTNode.sentinel) {
          expect(node.right).toBeDefined();
          expect(visited).not.toContain(node.right);
          checkNodeLinks(node.right, node)
        }
      }
      checkNodeLinks(tree);
    }


    const checkEqualStructure = (oak, pine) => {
      const unlinkNode = (node) => {
        if (node.left === RBTNode.sentinel) {
          delete node.left;
        } else if (node.left) {
          unlinkNode(node.left);
        }
        delete node.parent;
        if (node.right === RBTNode.sentinel) {
          delete node.right;
        } else if (node.right) {
          unlinkNode(node.right);
        }
      }
      unlinkNode(oak);
      unlinkNode(pine);
      expect(oak).toStrictEqual(pine);
    }

    describe('left', () => {
      it('correctly rotates the root left', () => {
        const expectedStructure = {
          key: 'f',
          left: {
            key: 'd',
            left: mockTrees.balanced.left,
            right: { key: 'e' },
          },
          right: { key: 'g' },
        };
        rbTree._root = linkTree(mockTrees.balanced);
        rbTree._rotateLeft(rbTree._root);

        expect(rbTree._root.key).toBe('f');
        checkTreeLinks(rbTree._root);
        checkEqualStructure(rbTree._root, expectedStructure);
      });

      it('correctly rotates a non-root node left', () => {
        const expectedStructure = {
          ...mockTrees.balanced,
          left: {
            key: 'c',
            left: {
              key: 'b',
              left: { key: 'a' }
            }
          }
        };
        rbTree._root = linkTree(mockTrees.balanced);
        rbTree._rotateLeft(rbTree._root.left);

        checkTreeLinks(rbTree._root);
        checkEqualStructure(rbTree._root, expectedStructure);
      });

      it('correctly rotates a node with a sentinel as left child', () => {
        const expectedStructure = {
          key: 'b',
          left: { key: 'a' },
          right: mockTrees.rightSpine.right.right,
        };
        rbTree._root = linkTree(mockTrees.rightSpine);
        rbTree._rotateLeft(rbTree._root);

        checkTreeLinks(rbTree._root);
        checkEqualStructure(rbTree._root, expectedStructure);
      });

      it("throws when asked to rotate a sentinel node", () => {
        rbTree._root = linkTree(mockTrees.rightSpine);
        expect(() => rbTree._rotateLeft(rbTree._root.left)).toThrow();
      });

      it("throws when asked to rotate away from a sentinel", () => {
        rbTree._root = linkTree(mockTrees.leftSpine);
        expect(() => rbTree._rotateLeft(rbTree._root)).toThrow();
      });
    });

    describe('right', () => {
      it('correctly rotates the root right', () => {
        const expectedStructure = {
          key: 'b',
          left: { key: 'a' },
          right: {
            key: 'd',
            left: { key: 'c' },
            right: mockTrees.balanced.right,
          },
        };
        rbTree._root = linkTree(mockTrees.balanced);
        rbTree._rotateRight(rbTree._root);

        expect(rbTree._root.key).toBe('b');
        checkTreeLinks(rbTree._root);
        checkEqualStructure(rbTree._root, expectedStructure);
      });

      it('correctly rotates a non-root node right', () => {
        const expectedStructure = {
          ...mockTrees.balanced,
          left: {
            key: 'a',
            right: {
              key: 'b',
              right: { key: 'c' }
            }
          }
        };
        rbTree._root = linkTree(mockTrees.balanced);
        rbTree._rotateRight(rbTree._root.left);

        checkTreeLinks(rbTree._root);
        checkEqualStructure(rbTree._root, expectedStructure);
      });

      it('correctly rotates a node with a sentinel as right child', () => {
        const expectedStructure = {
          key: 'b',
          right: { key: 'a' },
          left: mockTrees.leftSpine.left.left,
        };
        rbTree._root = linkTree(mockTrees.leftSpine);
        rbTree._rotateRight(rbTree._root);

        checkTreeLinks(rbTree._root);
        checkEqualStructure(rbTree._root, expectedStructure);
      });

      it("throws when asked to rotate a sentinel node", () => {
        rbTree._root = linkTree(mockTrees.leftSpine);
        expect(() => rbTree._rotateRight(rbTree._root.right)).toThrow();
      });

      it("throws when asked to rotate away from a sentinel", () => {
        rbTree._root = linkTree(mockTrees.rightSpine);
        expect(() => rbTree._rotateRight(rbTree._root)).toThrow();
      });
    });
  });
});