"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./fas/state");
var nfa_1 = require("./fas/nfa");
// (1|0)*1
var one = new state_1.SingleInputState('1');
var zero = new state_1.SingleInputState('0');
var oneOrZero = new state_1.UnionState(one, zero);
var oneOrZeroStar = new state_1.ClosureState(oneOrZero);
var final = new state_1.ConcatState(oneOrZeroStar, new state_1.SingleInputState('1', true));
var dfa = new nfa_1.NFA(final).toDFA();
console.log(dfa.test('1'));
console.log('-------------', dfa.test('00000000001'));
console.log('-------------', dfa.test('10101010000101'));
console.log('-------------', dfa.test('01010011000101011'));
console.log('-------------', dfa.test('010100110001010110'));
console.log('-------------', dfa.test(''));
console.log('-------------', dfa.test('0000000000000000'));
console.log('-------------', dfa.test('11111111111'));
