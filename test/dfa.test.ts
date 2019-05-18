import { SingleInputState, UnionState, ClosureState, ConcatState } from '../src/fas/state';
import { DFA } from '../src/fas/dfa';
import { NFA } from '../src/fas/nfa';

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
