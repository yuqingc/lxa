import { stateOps, epsilon, DFA, NFA, concatMultipleStates, unionMultipleStates } from '../src';
const { SingleInputState, UnionState, ClosureState, ConcatState } = stateOps;

test('(1|0)*1 should work', () => {
  const final = new ConcatState(
    new ClosureState(
      new UnionState(
        new SingleInputState('1'),
        new SingleInputState('0')
      )
    ),
    new SingleInputState('1', true)
  );
  
  const dfa: DFA = new NFA(final).toDFA();
  expect(dfa.test('1')).toBe(true);
  expect(dfa.test('11')).toBe(true);
  expect(dfa.test('01')).toBe(true);
  expect(dfa.test('11111')).toBe(true);
  expect(dfa.test('00001')).toBe(true);
  expect(dfa.test('101010111')).toBe(true);
  expect(dfa.test('01001')).toBe(true);

  expect(dfa.test('0')).toBe(false);
  expect(dfa.test('hello')).toBe(false);
  expect(dfa.test('a')).toBe(false);
  expect(dfa.test('111010110')).toBe(false);
  expect(dfa.test('00000')).toBe(false);
})

// http(s|epsilon)
test('https? should work', () => {
  const final = new ConcatState(
    new ConcatState(
      new ConcatState(
        new ConcatState(
          new SingleInputState('h'),
          new SingleInputState('t'),
        ),
        new SingleInputState('t'),
      ),
      new SingleInputState('p')
    ),
    new UnionState(
      new SingleInputState('s'),
      new SingleInputState(epsilon),
      true
    )
  );
  const dfa: DFA = new NFA(final).toDFA();

  expect(dfa.test('http')).toBe(true);
  expect(dfa.test('https')).toBe(true);


  expect(dfa.test('https://')).toBe(false);
  expect(dfa.test('htt')).toBe(false);
  expect(dfa.test('hello')).toBe(false);
})

// .jpe?g
test('.jpe?g should work', () => {
  const final = concatMultipleStates(
    new SingleInputState('.'),
    new SingleInputState('j'),
    new SingleInputState('p'),
    unionMultipleStates({states: [
      new SingleInputState('e'),
      new SingleInputState(epsilon),
    ]}),
    new SingleInputState('g', true)
  );
  const dfa: DFA = new NFA(final).toDFA();

  expect(dfa.test('.jpg')).toBe(true);
  expect(dfa.test('.jpeg')).toBe(true);
  expect(dfa.test('')).toBe(false);
  expect(dfa.test('jpg')).toBe(false);
  expect(dfa.test('jpeg')).toBe(false);
  expect(dfa.test('jp')).toBe(false);
  expect(dfa.test('jpgg')).toBe(false);
  expect(dfa.test('png')).toBe(false);
})

// (a|b)*cd?
test ('(a|b)*cd? should work', () => {
  // state for single character 'a' and 'b'
  const state_for_a = new SingleInputState('a');
  const state_for_b = new SingleInputState('b');

  // and generate the union of 'a' and 'b', (a|b)
  const union_of_a_and_b = new UnionState(state_for_a, state_for_b);

  // and then the closure `(a|b)*`
  const union_of_a_and_b_closure = new ClosureState(union_of_a_and_b);

  // Before we generate the final expression,
  // we generate the union of 'd' and empty string,
  // representing `d?` or `d|ε`
  const d_or_empty = new UnionState(
    new SingleInputState('d'),
    new SingleInputState(epsilon),
    // `true` means this is the final accepted state.
    // Refer to API doc for more detail.
    true,
  );

  // Finally, we concatenate them all
  const final = concatMultipleStates(
    union_of_a_and_b_closure, 
    new SingleInputState('c'),
    d_or_empty
  );
  const dfa = new NFA(final).toDFA();

  expect(dfa.test('aaac')).toBe(true);
  expect(dfa.test('abcd')).toBe(true);
  expect(dfa.test('bbbcd')).toBe(true);
  expect(dfa.test('ad')).toBe(false);
})
