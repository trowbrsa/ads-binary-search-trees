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
    let node = this._root;
    let parent = node?.parent;

    // Nodes without keys are considered sentinels
    while (node?.key) {
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

  _insertInternal(key, value = true) {
    const results = this._findNode(key);
    let { node } = results;
    const { parent } = results;

    if (node?.key) {
      // key already in the tree, replace the value
      node.value = value;

    } else {
      // new node
      node = new this.Node({ key, value, parent });
      this._count += 1;

      if (parent?.key) {
        if (key < parent.key) {
          parent.left = node;
        } else {
          parent.right = node;
        }

      } else {
        this._root = node;
      }
    }
    return node;
  }

  insert(key, value) {
    // same as insertInternal, but doesn't return the node to preserve encapsulation
    this._insertInternal(key, value);
  }

  lookup(key) {
    // Hooray for optional chaining!
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
    return this._findNode(key).node?.value;
  }

  delete(key) {
    // TODO
  }

  count() {
    return this._count;
  }

  _visit(node, callback, i = 0) {
    if (node?.key) {
      i = this._visit(node.left, callback, i);
      callback({ key: node.key, value: node.value }, i, this);
      i = this._visit(node.right, callback, i + 1);
    }
    return i;
  }

  forEach(callback) {
    this._visit(this._root, callback)
  }
}

export default BinarySearchTree;