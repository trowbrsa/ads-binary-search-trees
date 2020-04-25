class BSTNode {
  constructor({ key, value, parent, left, right }) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(Node = BSTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  _findNode(key) {
    // Retuns {node, parent}, either of which may be undefined
    // Node undefined means the key isn't in the tree
    // Parent undefined means node is the root
    let parent = undefined;
    let node = this._root;

    while (node) {
      if (key < node.key) {
        parent = node;
        node = node.left;
      } else if (key > node.key) {
        parent = node;
        node = node.right;
      } else { // equal
        break;
      }
    }
    return { node, parent }
  }

  insert(key, value = true) {
    const { node, parent } = this._findNode(key);
    if (node) {
      // replace
      node.value = value;

    } else {
      // new node
      const newNode = new this.Node({ key, value, parent });
      this._count += 1;

      if (parent) {
        if (key < parent.key) {
          parent.left = newNode;
        } else {
          parent.right = newNode;
        }
      } else {
        this._root = newNode;
      }
    }
  }

  lookup(key) {
    // Hooray for optional chaining!
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
    return this._findNode(key).node?.value;
  }

  delete(key) {

  }

  count() {
    return this._count;
  }

  forEach(callback) {

  }
}

export default BinarySearchTree;