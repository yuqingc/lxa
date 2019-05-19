import { concatMultipleStates, unionMultipleStates } from './combineStateOps';
import * as states from'./stateOps';
const { SingleInputState, ConcatState, UnionState } = states;


test('Should concat multiple state operations', () => {
  const one = new SingleInputState('1');
  const zero = new SingleInputState('0');
  
  // 10
  const oneZero = new ConcatState(one, zero);
  // a
  const charA = new SingleInputState('a');
  // 10a
  const oneZeroA = new ConcatState(oneZero, charA);
  // 1|0
  const oneOrZero = new UnionState(one, zero);
  //10a(1|0)
  const oneZeroAOneOrZero = new ConcatState(oneZeroA, oneOrZero);
  expect(() => concatMultipleStates()).toThrow();
  expect(concatMultipleStates(one)).toBe(one);
  expect(concatMultipleStates(one, zero)).toEqual(oneZero);
  expect(concatMultipleStates(one, zero, charA)).toEqual(oneZeroA);
  expect(concatMultipleStates(one, zero, charA, oneOrZero)).toEqual(oneZeroAOneOrZero);
})

test('Should union multiple state operations', () => {
  const one = new SingleInputState('1');
  const zero = new SingleInputState('0');
  
  // 10
  const oneZero = new ConcatState(one, zero);
  // a
  const charA = new SingleInputState('a');
  // 1|0
  const oneOrZero = new UnionState(one, zero);
  expect(() => unionMultipleStates({states: []})).toThrow();
  expect(unionMultipleStates({states: [one]})).toEqual(one);
  expect(unionMultipleStates({states: [one, zero]})).toEqual(oneOrZero);
  expect(unionMultipleStates({states: [one, zero, charA]})).toEqual(new UnionState(new UnionState(one, zero), charA));
})
