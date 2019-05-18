import { mergeSetInto, eqSet } from './utils';

test('A set should be merged into another', () => {
  const testCases = [
    {
      container: new Set([1,2,3,4,5]),
      setToBeMerge: new Set([6,7]),
      expectedSet: new Set([1,2,3,4,5,6,7]),
    },
    {
      container: new Set([1,2,3]),
      setToBeMerge: new Set([1,2]),
      expectedSet: new Set([1,2,3]),
    },
    {
      container: new Set([1,2,3,4]),
      setToBeMerge: new Set([4,5,6]),
      expectedSet: new Set([1,2,3,4,5,6]),
    },
  ];
  for (const {container, setToBeMerge, expectedSet} of testCases) {
    const mergedSet = mergeSetInto(container, setToBeMerge)
    expect(mergedSet).toEqual(expectedSet);
    expect(mergedSet).toBe(container);
  }
});

test('two set are equal', () => {
  const testCases = [
    {
      a: new Set(['a', 'b', 'c', 'd']),
      b: new Set(['a', 'b', 'c', 'd']),
      equal: true,
    },
    {
      a: new Set(),
      b: new Set(),
      equal: true,
    },
    {
      a: new Set(['a', 'b', 'c']),
      b: new Set(['a', 'b', 'c', 'c']),
      equal: true,
    },
    {
      a: new Set(['a', 'b', 'c', 'b']),
      b: new Set(['a', 'b', 'c', 'c']),
      equal: true,
    },
    {
      a: new Set(['a', 'b', 'c']),
      b: new Set(['a', 'b', 'c', 'd']),
      equal: false,
    },
    {
      a: new Set(['a', 'b', 'c', 'd']),
      b: new Set(['a', 'b', 'c']),
      equal: false,
    },
    {
      a: new Set(),
      b: new Set(['a']),
      equal: false,
    }
  ];
  for (const {a, b, equal} of testCases) {
    expect(eqSet(a, b)).toEqual(equal);
  }
})
