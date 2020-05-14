import BinarySearchTree from "./binary_search_tree";

export class RBTNode {
  static BLACK = 'black';
  static RED = 'red';
  static sentinel = Object.freeze({ color: RBTNode.BLACK });

  constructor({
    key, value,
    color = RBTNode.RED,
    parent = RBTNode.sentinel,
    left = RBTNode.sentinel,
    right = RBTNode.sentinel,
  }) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class RedBlackTree extends BinarySearchTree {
  constructor() {
    super(RBTNode);
  }

  /**
   * The two rotation functions are symetric, and could presumably
   * be collapsed into one that takes a direction 'left' or 'right',
   * calculates the opposite, and uses [] instead of . to access.
   * 
   * Felt too confusing to be worth it. Plus I bet* the JIT optimizes two
   * functions with static lookups better than one with dynamic lookups.
   * 
   * (*without any evidence whatsoever)
   */
  _rotateLeft(node) {
    const child = node.right;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's left subtree into node's right subtree
    node.right = child.left;
    if (child.left.key) {
      child.left.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (!node.parent.key) {
      this._root = child;
    } else if (node === node.parent.left) {
      node.parent.left = child;
    } else {
      node.parent.right = child;
    }

    // put node on child's left
    child.left = node;
    node.parent = child;

    // LOOK AT ME
    // I'M THE PARENT NOW
  }

  _rotateRight(node) {
    const child = node.left;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's right subtree into node's left subtree
    node.left = child.right;
    if (child.right.key) {
      child.right.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (!node.parent.key) {
      this._root = child;
    } else if (node === node.parent.right) {
      node.parent.right = child;
    } else {
      node.parent.left = child;
    }

    // put node on child's right
    child.right = node;
    node.parent = child;
  }

  _insertFixup(node) {
    /**
     * The point of this look is to fix the problem of 2 red
     * nodes in a row: node, and its parent
     * - Node is the node we just added, so we know it's red
     * - If parent isn't red, we don't have a problem so we bail
     * That node and its parent are both red is an INVARIANT
     * 
     * This means:
     * - Neither node nor parent is the root (root is always black)
     * - The grandparent must be black (can't have 2 red nodes in a row
     *    and we know the tree was fine before we started)
     */
    while (node.color === RBTNode.RED && node.parent.color === RBTNode.RED) {
      const grandparent = node.parent.parent;
      if (node.parent === grandparent.left) {
        const uncle = grandparent.right;
        if (uncle.color === RBTNode.RED) {
          // CASE 1
          // Flip generation colors between parent and grandparent
          // This either solves the problem, if great-grandparent is black,
          // or moves the problem closer to the root where we know we can create space
          node.parent.color = RBTNode.BLACK;
          uncle.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;
          node = grandparent;

        } else {
          if (node === node.parent.right) {
            // CASE 2
            // Force a "left-leaning" alignment of red nodes
            node = node.parent;
            this._rotateLeft(node);
          }
          // CASE 3
          // Create some "wiggle room" for a red node
          // parent.color is no longer red, so we'll exit the loop
          node.parent.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;
          this._rotateRight(grandparent);
        }
      } else { // parent is the right child
        // Symetric to the above left child code
        const uncle = grandparent.left;
        if (uncle.color === RBTNode.RED) {
          // CASE 1
          node.parent.color = RBTNode.BLACK;
          uncle.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;
          node = grandparent;

        } else {
          if (node === node.parent.left) {
            // CASE 2
            node = node.parent;
            this._rotateRight(node);
          }
          // CASE 3
          node.parent.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;
          this._rotateLeft(grandparent);
        }
      }
    }
    this._root.color = RBTNode.BLACK;
  }

  insert(key, value) {
    const node = this._insertInternal(key, value);
    this._insertFixup(node);
  }
}


export default RedBlackTree;