import { SingleInputState, UnionState, ClosureState, ConcatState } from './fas/state';
import { DFA } from './fas/dfa';
import { NFA } from './fas/nfa';

// (1|0)*1

const one = new SingleInputState('1');
const zero = new SingleInputState('0');
const oneOrZero = new UnionState(one, zero);
const oneOrZeroStar = new ClosureState(oneOrZero);
const final = new ConcatState(oneOrZeroStar, new SingleInputState('1', true))

const dfa: DFA = new NFA(final).toDFA();

console.log(dfa.test('1'));
console.log('-------------', dfa.test('00000000001'));
console.log('-------------', dfa.test('10101010000101'));
console.log('-------------', dfa.test('01010011000101011'));
console.log('-------------', dfa.test('010100110001010110'));
console.log('-------------', dfa.test(''));
console.log('-------------', dfa.test('0000000000000000'));
console.log('-------------', dfa.test('11111111111'));
