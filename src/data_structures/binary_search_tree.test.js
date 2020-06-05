import BinarySearchTree from './binary_search_tree';

const dataStructures = [
  BinarySearchTree,
  // We'll add more next week
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

    describe('lookup', () => {
      // it('returns undefined on an empty tree', () => {
      //   expect(bst.lookup('test')).toBe(undefined);
      // });

      it.only('returns undefined if the key is not in the tree', () => {
        // const keys = ['many', 'keys', 'for', 'this', 'tree'];
        const keys = ['many', 'keys', 'for'];
        keys.forEach((key, i) => {
          bst.insert(key);
        });

        expect(bst.lookup('dne')).toBe(undefined);
      });

      it.only('finds the only record', () => {
        bst.insert('test');
        expect(bst.lookup('test')).toBeTruthy();
      });

      it.only('finds any extant record', () => {
        const keys = ['many', 'keys', 'for', 'this', 'tree'];
        keys.forEach(key => {
          bst.insert(key);
        });

        keys.forEach(key => {
          expect(bst.lookup(key)).toBeTruthy();
        });

        keys.reverse().forEach(key => {
          expect(bst.lookup(key)).toBeTruthy();
        });
      });

      it.only('returns the value associated with a record', () => {
        const records = [
          { key: 'one', value: 'first' },
          { key: 'two', value: 'second' },
          { key: 'three', value: 'third' },
          { key: 'four', value: 'fourth' },
          { key: 'five', value: 'fifth' },
        ];

        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        records.forEach(({ key, value }) => {
          expect(bst.lookup(key)).toBe(value);
        });

        records.reverse().forEach(({ key, value }) => {
          expect(bst.lookup(key)).toBe(value);
        });
      });
    });

    describe('insert', () => {
      it.only('increases count by 1', () => {
        expect(bst.count()).toBe(0);
        bst.insert('test');
        expect(bst.count()).toBe(1);

        const keys = ['many', 'keys', 'for', 'this', 'tree'];
        keys.forEach((key, i) => {
          bst.insert(key);
          expect(bst.count()).toBe(2 + i);
        });
      });

      it.only('replaces records with the same key and does not increase the count', () => {
        bst.insert('test', 'first value');
        expect(bst.count()).toBe(1);
        expect(bst.lookup('test')).toBe('first value');

        bst.insert('test', 'second value');
        expect(bst.count()).toBe(1);
        expect(bst.lookup('test')).toBe('second value');
      });

      it.only('uses true as the default value', () => {
        bst.insert('test');
        expect(bst.lookup('test')).toBe(true);
      });
    });

    describe('delete', () => {
      it('returns the value for the removed record', () => {
        bst.insert('test-key', 'test-value');

        expect(bst.delete('test-key')).toBe('test-value');

        expect(bst.lookup('test-key')).toBeUndefined();
      });

      it('returns undefined if the record was not found', () => {
        expect(bst.delete('not found')).toBeUndefined();
      });

      it('reduces the count by 1', () => {
        const records = [
          { key: 'one', value: 'first' },
          { key: 'two', value: 'second' },
          { key: 'delete-me', value: 'delete-value' },
          { key: 'four', value: 'fourth' },
          { key: 'five', value: 'fifth' },
        ];

        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        expect(bst.count()).toBe(5);

        bst.delete('delete-me');

        expect(bst.count()).toBe(4);
      });

      it('omits the removed record from iteration results', () => {
        const records = [
          { key: 'one', value: 'first' },
          { key: 'two', value: 'second' },
          { key: 'delete-me', value: 'delete-value' },
          { key: 'four', value: 'fourth' },
          { key: 'five', value: 'fifth' },
        ];

        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        bst.delete('delete-me');

        const cb = jest.fn();
        bst.forEach(cb);

        const calls = cb.mock.calls
        expect(calls.length).toBe(records.length - 1);

        expect(calls.map(call => call[0].key)).not.toContain('delete-me');
      });

      it('can remove every element in a tree', () => {
        const records = [
          { key: 'one', value: 'first' },
          { key: 'two', value: 'second' },
          { key: 'three', value: 'third' },
          { key: 'four', value: 'fourth' },
          { key: 'five', value: 'fifth' },
        ];

        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        records.forEach(({ key, value }) => {
          expect(bst.delete(key)).toBe(value);
        });
      });

      describe('scenarios', () => {
        // The first step for each of these tests will be to construct
        // a tree matching the scenario. How can you use your knowledge
        // of how insert works to do this? How can you check your work?

        it('can remove the record with the smallest key', () => {
          // TODO:
          // Insert several records
          // Remove the record with the smallest key
          // Ensure that looking up that key returns undefined
        });

        it('can remove the record with the largest key', () => {

        });

        it('can remove the root', () => {

        });

        it('can remove a node with no children', () => {

        });

        it('can remove a node with only a left child', () => {

        });

        it('can remove a node with only a right child', () => {

        });

        it('can remove a node with both children, where the successor is the node\'s right child', () => {

        });

        it('can remove a node with both children, where the successor is not the node\'s right child', () => {

        });
      });
    });

    describe('forEach', () => {
      let records;
      beforeEach(() => {
        records = [
          { key: 'one', value: 'first' },
          { key: 'two', value: 'second' },
          { key: 'three', value: 'third' },
          { key: 'four', value: 'fourth' },
          { key: 'five', value: 'fifth' },
        ];
      });

      const sortRecords = (records) => {
        return records.sort((a, b) => a.key.localeCompare(b.key));
      }

      const fill = (records) => {
        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });
      }

      it('runs the callback 0 times on an empty tree', () => {
        const cb = jest.fn();
        bst.forEach(cb);

        expect(cb.mock.calls.length).toBe(0);
      });

      it('provides {key, value}, index and tree as cb args', () => {
        bst.insert('key', 'value');

        const cb = jest.fn();
        bst.forEach(cb);

        const callArgs = cb.mock.calls[0];
        expect(callArgs[0].key).toBe('key');
        expect(callArgs[0].value).toBe('value');
        expect(callArgs[1]).toBe(0);
        expect(callArgs[2]).toBe(bst);
      });

      it('iterates records in key order', () => {
        fill(records);

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });

      it('iterates correctly for sorted input', () => {
        fill(sortRecords(records));

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });

      it('iterates correctly for reverse-sorted input', () => {
        fill(sortRecords(records).reverse());

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });
    });
  });
});