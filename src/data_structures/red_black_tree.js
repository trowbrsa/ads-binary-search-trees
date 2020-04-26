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

  }

  _insertFixup(node) {
    // while (node.parent.color === RBTNode.RED) {

    // }
    node.color = RBTNode.BLACK;
  }

  insert(key, value) {
    const node = this._insertInternal(key, value);
    this._insertFixup(node);
  }
}


export default RedBlackTree;