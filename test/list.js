'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { List } = require('..');

// Phase 1: Core Infrastructure

test('List constructor creates empty list', () => {
  const list = new List();
  assert.strictEqual(list.size, 0);
});

test('List constructor pre-allocates but starts empty', () => {
  const list = new List(10);
  assert.strictEqual(list.size, 0);
});

test('List size getter returns element count', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.size, 3);
});

test('List Symbol.iterator allows for...of', () => {
  const list = List.fromArray([1, 2, 3]);
  const result = [];
  for (const item of list) {
    result.push(item);
  }
  assert.deepStrictEqual(result, [1, 2, 3]);
});

test('List Symbol.iterator allows spread', () => {
  const list = List.fromArray(['a', 'b', 'c']);
  assert.deepStrictEqual([...list], ['a', 'b', 'c']);
});

test('List toArray returns copy of elements', () => {
  const list = List.fromArray([1, 2, 3]);
  const arr = list.toArray();
  assert.deepStrictEqual(arr, [1, 2, 3]);
  arr.push(4);
  assert.strictEqual(list.size, 3);
});

test('List clone creates independent copy', () => {
  const list = List.fromArray([1, 2, 3]);
  const cloned = list.clone();
  cloned.append(4);
  assert.strictEqual(list.size, 3);
  assert.strictEqual(cloned.size, 4);
});

test('List clear removes all elements', () => {
  const list = List.fromArray([1, 2, 3]);
  list.clear();
  assert.strictEqual(list.size, 0);
  assert.deepStrictEqual([...list], []);
});

// Phase 2: Basic Operations

test('List at returns element at index', () => {
  const list = List.fromArray([10, 20, 30]);
  assert.strictEqual(list.at(0), 10);
  assert.strictEqual(list.at(1), 20);
  assert.strictEqual(list.at(2), 30);
});

test('List at supports negative indices', () => {
  const list = List.fromArray([10, 20, 30]);
  assert.strictEqual(list.at(-1), 30);
  assert.strictEqual(list.at(-2), 20);
  assert.strictEqual(list.at(-3), 10);
});

test('List at returns undefined for out of bounds', () => {
  const list = List.fromArray([1, 2]);
  assert.strictEqual(list.at(5), undefined);
  assert.strictEqual(list.at(-5), undefined);
});

test('List set modifies element at index', () => {
  const list = List.fromArray([1, 2, 3]);
  list.set(1, 99);
  assert.deepStrictEqual([...list], [1, 99, 3]);
});

test('List set supports negative indices', () => {
  const list = List.fromArray([1, 2, 3]);
  list.set(-1, 99);
  assert.deepStrictEqual([...list], [1, 2, 99]);
});

test('List set ignores out of bounds', () => {
  const list = List.fromArray([1, 2, 3]);
  list.set(10, 99);
  list.set(-10, 99);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('List first returns first element', () => {
  const list = List.fromArray([10, 20, 30]);
  assert.strictEqual(list.first(), 10);
});

test('List first returns undefined for empty list', () => {
  const list = new List();
  assert.strictEqual(list.first(), undefined);
});

test('List last returns last element', () => {
  const list = List.fromArray([10, 20, 30]);
  assert.strictEqual(list.last(), 30);
});

test('List last returns undefined for empty list', () => {
  const list = new List();
  assert.strictEqual(list.last(), undefined);
});

test('List append adds to end', () => {
  const list = List.fromArray([1, 2]);
  list.append(3);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('List prepend adds to start', () => {
  const list = List.fromArray([2, 3]);
  list.prepend(1);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('List insert adds at index', () => {
  const list = List.fromArray([1, 4]);
  list.insert(1, 2);
  assert.deepStrictEqual([...list], [1, 2, 4]);
});

test('List insert with count adds multiple', () => {
  const list = List.fromArray([1, 5]);
  list.insert(1, 0, 3);
  assert.deepStrictEqual([...list], [1, 0, 0, 0, 5]);
});

test('List delete removes at index', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  list.delete(1);
  assert.deepStrictEqual([...list], [1, 3, 4]);
});

test('List delete with count removes multiple', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.delete(1, 3);
  assert.deepStrictEqual([...list], [1, 5]);
});

// Phase 3: Queue/Stack Operations

test('List enqueue adds to end (alias for append)', () => {
  const list = List.fromArray([1, 2]);
  list.enqueue(3);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('List dequeue removes and returns first element', () => {
  const list = List.fromArray([1, 2, 3]);
  const value = list.dequeue();
  assert.strictEqual(value, 1);
  assert.deepStrictEqual([...list], [2, 3]);
});

test('List dequeue returns undefined for empty list', () => {
  const list = new List();
  assert.strictEqual(list.dequeue(), undefined);
});

// Phase 4: Static Factory Methods

test('List.fromArray creates list from array', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('List.fromIterator creates list from iterator', () => {
  const set = new Set([1, 2, 3]);
  const list = List.fromIterator(set);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('List.fromIterator works with generator', () => {
  function* gen() {
    yield 'a';
    yield 'b';
    yield 'c';
  }
  const list = List.fromIterator(gen());
  assert.deepStrictEqual([...list], ['a', 'b', 'c']);
});

test('List.range creates ascending range', () => {
  const list = List.range(0, 5);
  assert.deepStrictEqual([...list], [0, 1, 2, 3, 4]);
});

test('List.range with step', () => {
  const list = List.range(0, 10, 2);
  assert.deepStrictEqual([...list], [0, 2, 4, 6, 8]);
});

test('List.range descending with negative step', () => {
  const list = List.range(5, 0, -1);
  assert.deepStrictEqual([...list], [5, 4, 3, 2, 1]);
});

test('List.range empty when step is zero', () => {
  const list = List.range(0, 5, 0);
  assert.strictEqual(list.size, 0);
});

test('List.merge combines multiple lists', () => {
  const a = List.fromArray([1, 2]);
  const b = List.fromArray([3, 4]);
  const c = List.fromArray([5]);
  const merged = List.merge([a, b, c]);
  assert.deepStrictEqual([...merged], [1, 2, 3, 4, 5]);
});

test('List.merge works with empty lists', () => {
  const a = List.fromArray([1]);
  const b = new List();
  const c = List.fromArray([2]);
  const merged = List.merge([a, b, c]);
  assert.deepStrictEqual([...merged], [1, 2]);
});

// Phase 5: Slicing & Subsetting

test('List slice extracts portion', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const sliced = list.slice(1, 4);
  assert.deepStrictEqual([...sliced], [2, 3, 4]);
});

test('List slice with negative indices', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const sliced = list.slice(-3, -1);
  assert.deepStrictEqual([...sliced], [3, 4]);
});

test('List slice without arguments copies all', () => {
  const list = List.fromArray([1, 2, 3]);
  const sliced = list.slice();
  assert.deepStrictEqual([...sliced], [1, 2, 3]);
});

test('List head returns all but last element', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  const head = list.head();
  assert.deepStrictEqual([...head], [1, 2, 3]);
});

test('List head on single element returns empty', () => {
  const list = List.fromArray([1]);
  const head = list.head();
  assert.strictEqual(head.size, 0);
});

test('List tail returns all but first element', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  const tail = list.tail();
  assert.deepStrictEqual([...tail], [2, 3, 4]);
});

test('List tail on single element returns empty', () => {
  const list = List.fromArray([1]);
  const tail = list.tail();
  assert.strictEqual(tail.size, 0);
});

test('List take positive n from start', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const taken = list.take(3);
  assert.deepStrictEqual([...taken], [1, 2, 3]);
});

test('List take negative n from end', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const taken = list.take(-2);
  assert.deepStrictEqual([...taken], [4, 5]);
});

test('List drop positive n removes from start', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.drop(2);
  assert.deepStrictEqual([...list], [3, 4, 5]);
});

test('List drop negative n removes from end', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.drop(-2);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('List splitAt divides list', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const { before, after } = list.splitAt(2);
  assert.deepStrictEqual([...before], [1, 2]);
  assert.deepStrictEqual([...after], [3, 4, 5]);
});

test('List splitAt at start', () => {
  const list = List.fromArray([1, 2, 3]);
  const { before, after } = list.splitAt(0);
  assert.strictEqual(before.size, 0);
  assert.deepStrictEqual([...after], [1, 2, 3]);
});

test('List splitAt at end', () => {
  const list = List.fromArray([1, 2, 3]);
  const { before, after } = list.splitAt(3);
  assert.deepStrictEqual([...before], [1, 2, 3]);
  assert.strictEqual(after.size, 0);
});

// Phase 6: Search Operations

test('List includes returns true when value exists', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.includes(2), true);
});

test('List includes returns false when value missing', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.includes(5), false);
});

test('List indexOf returns first index', () => {
  const list = List.fromArray([1, 2, 3, 2]);
  assert.strictEqual(list.indexOf(2), 1);
});

test('List indexOf returns -1 when not found', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.indexOf(5), -1);
});

test('List lastIndexOf returns last index', () => {
  const list = List.fromArray([1, 2, 3, 2]);
  assert.strictEqual(list.lastIndexOf(2), 3);
});

test('List find returns matching element', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  assert.strictEqual(list.find((x) => x > 2), 3);
});

test('List find returns undefined when no match', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.find((x) => x > 10), undefined);
});

test('List findIndex returns index of match', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  assert.strictEqual(list.findIndex((x) => x > 2), 2);
});

test('List findIndex returns -1 when no match', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.findIndex((x) => x > 10), -1);
});

test('List equals returns true for equal lists', () => {
  const a = List.fromArray([1, 2, 3]);
  const b = List.fromArray([1, 2, 3]);
  assert.strictEqual(a.equals(b), true);
});

test('List equals returns false for different lengths', () => {
  const a = List.fromArray([1, 2, 3]);
  const b = List.fromArray([1, 2]);
  assert.strictEqual(a.equals(b), false);
});

test('List equals returns false for different values', () => {
  const a = List.fromArray([1, 2, 3]);
  const b = List.fromArray([1, 2, 4]);
  assert.strictEqual(a.equals(b), false);
});

// Phase 7: Bulk Modifications

test('List addAll adds multiple values', () => {
  const list = List.fromArray([1, 2]);
  list.addAll([3, 4, 5]);
  assert.deepStrictEqual([...list], [1, 2, 3, 4, 5]);
});

test('List addAll works with iterables', () => {
  const list = List.fromArray([1]);
  list.addAll(new Set([2, 3]));
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('List removeAll removes matching values', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.removeAll([2, 4]);
  assert.deepStrictEqual([...list], [1, 3, 5]);
});

test('List removeAll handles duplicates', () => {
  const list = List.fromArray([1, 2, 2, 3, 2]);
  list.removeAll([2]);
  assert.deepStrictEqual([...list], [1, 3]);
});

test('List fill fills entire list', () => {
  const list = List.fromArray([1, 2, 3]);
  list.fill(0);
  assert.deepStrictEqual([...list], [0, 0, 0]);
});

test('List fill fills range', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.fill(0, 1, 4);
  assert.deepStrictEqual([...list], [1, 0, 0, 0, 5]);
});

test('List replace replaces first occurrence', () => {
  const list = List.fromArray([1, 2, 3, 2]);
  list.replace(2, 99);
  assert.deepStrictEqual([...list], [1, 99, 3, 2]);
});

test('List replace does nothing if not found', () => {
  const list = List.fromArray([1, 2, 3]);
  list.replace(5, 99);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

// Phase 8: Reordering

test('List swap exchanges two elements', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  list.swap(0, 3);
  assert.deepStrictEqual([...list], [4, 2, 3, 1]);
});

test('List swap with negative indices', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  list.swap(0, -1);
  assert.deepStrictEqual([...list], [4, 2, 3, 1]);
});

test('List move relocates element', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.move(0, 3);
  assert.deepStrictEqual([...list], [2, 3, 4, 1, 5]);
});

test('List rotate positive shifts right', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.rotate(2);
  assert.deepStrictEqual([...list], [4, 5, 1, 2, 3]);
});

test('List rotate negative shifts left', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.rotate(-2);
  assert.deepStrictEqual([...list], [3, 4, 5, 1, 2]);
});

test('List rotateLeft shifts left', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  list.rotateLeft(1);
  assert.deepStrictEqual([...list], [2, 3, 4, 1]);
});

test('List rotateRight shifts right', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  list.rotateRight(1);
  assert.deepStrictEqual([...list], [4, 1, 2, 3]);
});

test('List reverse reverses in place', () => {
  const list = List.fromArray([1, 2, 3]);
  list.reverse();
  assert.deepStrictEqual([...list], [3, 2, 1]);
});

test('List toReversed returns reversed copy', () => {
  const list = List.fromArray([1, 2, 3]);
  const reversed = list.toReversed();
  assert.deepStrictEqual([...reversed], [3, 2, 1]);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

// Phase 9: Sorting & Shuffling

test('List sort sorts in place', () => {
  const list = List.fromArray([3, 1, 2]);
  list.sort((a, b) => a - b);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('List sort with default comparator', () => {
  const list = List.fromArray(['c', 'a', 'b']);
  list.sort();
  assert.deepStrictEqual([...list], ['a', 'b', 'c']);
});

test('List toSorted returns sorted copy', () => {
  const list = List.fromArray([3, 1, 2]);
  const sorted = list.toSorted((a, b) => a - b);
  assert.deepStrictEqual([...sorted], [1, 2, 3]);
  assert.deepStrictEqual([...list], [3, 1, 2]);
});

test('List shuffle randomizes order', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.shuffle();
  const arr = [...list].sort();
  assert.deepStrictEqual(arr, [1, 2, 3, 4, 5]);
});

test('List shuffle with custom random', () => {
  const list = List.fromArray([1, 2, 3]);
  let callCount = 0;
  list.shuffle(() => {
    callCount++;
    return 0.5;
  });
  assert(callCount > 0);
});

test('List toShuffled returns shuffled copy', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const shuffled = list.toShuffled();
  assert.deepStrictEqual([...list], [1, 2, 3, 4, 5]);
  assert.deepStrictEqual([...shuffled].sort(), [1, 2, 3, 4, 5]);
});

// Phase 10: Deduplication

test('List distinct removes duplicates in place', () => {
  const list = List.fromArray([1, 2, 2, 3, 1, 4]);
  list.distinct();
  assert.deepStrictEqual([...list], [1, 2, 3, 4]);
});

test('List distinct on unique list unchanged', () => {
  const list = List.fromArray([1, 2, 3]);
  list.distinct();
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('List toDistinct returns deduplicated copy', () => {
  const list = List.fromArray([1, 2, 2, 3, 1]);
  const unique = list.toDistinct();
  assert.deepStrictEqual([...unique], [1, 2, 3]);
  assert.deepStrictEqual([...list], [1, 2, 2, 3, 1]);
});

// Phase 11: Functional Methods

test('List map transforms elements', () => {
  const list = List.fromArray([1, 2, 3]);
  const doubled = list.map((x) => x * 2);
  assert.deepStrictEqual([...doubled], [2, 4, 6]);
});

test('List map receives index', () => {
  const list = List.fromArray(['a', 'b', 'c']);
  const indexed = list.map((v, i) => `${i}:${v}`);
  assert.deepStrictEqual([...indexed], ['0:a', '1:b', '2:c']);
});

test('List flatMap flattens arrays', () => {
  const list = List.fromArray([1, 2, 3]);
  const flat = list.flatMap((x) => [x, x * 10]);
  assert.deepStrictEqual([...flat], [1, 10, 2, 20, 3, 30]);
});

test('List flatMap works with Lists', () => {
  const list = List.fromArray([1, 2]);
  const flat = list.flatMap((x) => List.fromArray([x, x]));
  assert.deepStrictEqual([...flat], [1, 1, 2, 2]);
});

test('List filter removes non-matching', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const evens = list.filter((x) => x % 2 === 0);
  assert.deepStrictEqual([...evens], [2, 4]);
});

test('List filter receives index', () => {
  const list = List.fromArray(['a', 'b', 'c', 'd']);
  const odd = list.filter((_, i) => i % 2 === 1);
  assert.deepStrictEqual([...odd], ['b', 'd']);
});

test('List reduce accumulates value', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  const sum = list.reduce((acc, v) => acc + v, 0);
  assert.strictEqual(sum, 10);
});

test('List some returns true if any match', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.some((x) => x > 2), true);
  assert.strictEqual(list.some((x) => x > 10), false);
});

test('List every returns true if all match', () => {
  const list = List.fromArray([2, 4, 6]);
  assert.strictEqual(list.every((x) => x % 2 === 0), true);
  assert.strictEqual(list.every((x) => x > 3), false);
});

test('List sum adds numbers', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  assert.strictEqual(list.sum(), 10);
});

test('List sum with extractor', () => {
  const list = List.fromArray([{ v: 1 }, { v: 2 }, { v: 3 }]);
  assert.strictEqual(list.sum((x) => x.v), 6);
});

test('List sum of empty list is 0', () => {
  const list = new List();
  assert.strictEqual(list.sum(), 0);
});

test('List avg computes average', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.strictEqual(list.avg(), 3);
});

test('List avg with extractor', () => {
  const list = List.fromArray([{ v: 2 }, { v: 4 }]);
  assert.strictEqual(list.avg((x) => x.v), 3);
});

test('List avg of empty list is NaN', () => {
  const list = new List();
  assert.strictEqual(Number.isNaN(list.avg()), true);
});

test('List min returns smallest', () => {
  const list = List.fromArray([3, 1, 4, 1, 5]);
  assert.strictEqual(list.min(), 1);
});

test('List min with comparator', () => {
  const list = List.fromArray([{ v: 3 }, { v: 1 }, { v: 2 }]);
  const min = list.min((a, b) => a.v - b.v);
  assert.deepStrictEqual(min, { v: 1 });
});

test('List min of empty list is undefined', () => {
  const list = new List();
  assert.strictEqual(list.min(), undefined);
});

test('List max returns largest', () => {
  const list = List.fromArray([3, 1, 4, 1, 5]);
  assert.strictEqual(list.max(), 5);
});

test('List max with comparator', () => {
  const list = List.fromArray([{ v: 3 }, { v: 1 }, { v: 2 }]);
  const max = list.max((a, b) => a.v - b.v);
  assert.deepStrictEqual(max, { v: 3 });
});

test('List max of empty list is undefined', () => {
  const list = new List();
  assert.strictEqual(list.max(), undefined);
});

test('List groupBy groups elements', () => {
  const list = List.fromArray([1, 2, 3, 4, 5, 6]);
  const groups = list.groupBy((x) => (x % 2 === 0 ? 'even' : 'odd'));
  assert.deepStrictEqual([...groups.get('odd')], [1, 3, 5]);
  assert.deepStrictEqual([...groups.get('even')], [2, 4, 6]);
});

test('List groupBy returns Map of Lists', () => {
  const list = List.fromArray(['a', 'ab', 'abc', 'b', 'bc']);
  const groups = list.groupBy((s) => s.length);
  assert(groups instanceof Map);
  assert(groups.get(1) instanceof List);
});

// Phase 12: Lazy Iterators

test('List lazyMap returns iterator', () => {
  const list = List.fromArray([1, 2, 3]);
  const iter = list.lazyMap((x) => x * 2);
  assert.strictEqual(iter.next().value, 2);
  assert.strictEqual(iter.next().value, 4);
  assert.strictEqual(iter.next().value, 6);
  assert.strictEqual(iter.next().done, true);
});

test('List lazyMap can be spread', () => {
  const list = List.fromArray([1, 2, 3]);
  const result = [...list.lazyMap((x) => x * 2)];
  assert.deepStrictEqual(result, [2, 4, 6]);
});

test('List lazyFilter returns iterator', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const iter = list.lazyFilter((x) => x % 2 === 0);
  assert.strictEqual(iter.next().value, 2);
  assert.strictEqual(iter.next().value, 4);
  assert.strictEqual(iter.next().done, true);
});

test('List lazyFilter can be spread', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const result = [...list.lazyFilter((x) => x > 2)];
  assert.deepStrictEqual(result, [3, 4, 5]);
});

test('List lazyReduce yields running totals', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  const iter = list.lazyReduce((acc, v) => acc + v, 0);
  assert.strictEqual(iter.next().value, 1);
  assert.strictEqual(iter.next().value, 3);
  assert.strictEqual(iter.next().value, 6);
  assert.strictEqual(iter.next().value, 10);
  assert.strictEqual(iter.next().done, true);
});

test('List lazyReduce can be spread', () => {
  const list = List.fromArray([1, 2, 3]);
  const result = [...list.lazyReduce((acc, v) => acc + v, 0)];
  assert.deepStrictEqual(result, [1, 3, 6]);
});

// Phase 13: String/Output

test('List join with default separator', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.join(), '1,2,3');
});

test('List join with custom separator', () => {
  const list = List.fromArray(['a', 'b', 'c']);
  assert.strictEqual(list.join(' - '), 'a - b - c');
});

test('List join empty list', () => {
  const list = new List();
  assert.strictEqual(list.join(), '');
});

// Phase 14: Async Iterator

test('List async iterator yields existing items', async () => {
  const list = List.fromArray([1, 2, 3]);
  const result = [];
  const iter = list[Symbol.asyncIterator]();
  result.push((await iter.next()).value);
  result.push((await iter.next()).value);
  result.push((await iter.next()).value);
  assert.deepStrictEqual(result, [1, 2, 3]);
});

test('List async iterator waits for new items', async () => {
  const list = new List();
  const result = [];

  const iter = list[Symbol.asyncIterator]();
  const promise = iter.next();

  setTimeout(() => list.append(42), 10);
  const item = await promise;
  result.push(item.value);

  assert.deepStrictEqual(result, [42]);
});

test('List async iterator can be aborted with return', async () => {
  const list = new List();
  const iter = list[Symbol.asyncIterator]();
  const result = await iter.return();
  assert.strictEqual(result.done, true);
});
