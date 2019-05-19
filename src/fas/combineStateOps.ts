import { StateOp, ConcatState, UnionState } from './stateOps';

export function concatMultipleStates(...states: StateOp[]): StateOp {
  if (states.length === 0) {
    throw new Error('Argument must be at least one state');
  }
  if (states.length === 1) {
    return states[0];
  }
  return states.reduce((stateA, stateB) => {
    return new ConcatState(stateA, stateB);
  })
}

export function unionMultipleStates(
  {states, accepted = false}: {states: StateOp[], accepted?: boolean}
): StateOp {
  if (states.length === 0) {
    throw new Error('Argument must be at least one state');
  }
  if (states.length === 1) {
    return states[0];
  }
  return states.reduce((stateA, stateB, currentIndex) => {
    return new UnionState(stateA, stateB, (currentIndex === states.length - 1) && accepted);
  })
}
