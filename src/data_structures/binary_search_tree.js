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
    let current = this._root;
    let parent = undefined;

    if (!current) return { node: undefined, parent: undefined };

    while (current) {
      if (key < current.key) {
        parent = current;
        current = current.left;
      } else if (key > current.key) {
        parent = current;
        current = current.right;
      } else { // we have a match
        break;
      }
    }
    return { node: current, parent }
  }

  insert(key, value = true) {
    let current = this._root;
    let parent = undefined;

    if (!this._root) { // TODO: refactor to use _findNode instead
      const node = new BSTNode({ key, value })
      this._root = node;
      this._count += 1;
      return key;
    } else {
      current = this._root;

      while (current) {
        if (key < current.key) {
          parent = current;
          current = current.left;
        } else if (key >= current.key) {
          parent = current;
          current = current.right;
        }
      }
      if (key < parent.key) {
        parent.left = new BSTNode({ key, value, parent, left: undefined, right: undefined });
        this._count += 1;
      } else if (key > parent.key) {
        parent.right = new BSTNode({ key, value, parent, left: undefined, right: undefined });
        this._count += 1;
      } else { // we have a dupe, just replace value
        parent.value = value;
      }
      return key;
    }
  }

  lookup(key) {
    let node = this._root;

    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else { // equal
        return node.value;
      }
    }
  }

  delete(key) {
  }

  count() {
    return this._count;
  }

  forEach(callback) {
    // This is a little different from the version presented in the video.
    // The form is similar, but it invokes the callback with more arguments
    // to match the interface for Array.forEach:
    //   callback({ key, value }, i, this)
    const visitSubtree = (node, callback, i = 0) => {
      if (node) {
        i = visitSubtree(node.left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(node.right, callback, i + 1);
      }
      return i;
    }
    visitSubtree(this._root, callback)
  }

  forEachWithStack(callback) {
    let stack = [];

    let current = this._root;

    // use two stacks?

    while (current) {
      stack.push(current);
      stack.push(current.right);
      current = current.left;
    }
    // this is left
    current = stack.pop();
    console.log(current);
    // this is parent
    current = stack.pop();
    console.log(current);

    while (current) {
      current = current.right;
    }
  }


}

export default BinarySearchTree;