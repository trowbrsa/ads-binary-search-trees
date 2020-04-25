import BinarySearchTree from "./binary_search_tree";

class RBTNode {
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

  _insertFixup(node) {

  }

  insert(key, value) {
    const node = this._insertInternal(key, value);
    this._insertFixup(node);
  }
}


export default RedBlackTree;