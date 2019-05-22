# lxa

A lexical analysis / regular expression engine written in TypeScript

[![npm](https://img.shields.io/npm/v/lxa.svg)](https://www.npmjs.com/package/lxa)
![Codecov](https://img.shields.io/codecov/c/github/yuqingc/lxa.svg)
![GitHub issues](https://img.shields.io/github/issues/yuqingc/lxa.svg)
![Travis (.org)](https://img.shields.io/travis/yuqingc/lxa.svg)
![GitHub](https://img.shields.io/github/license/yuqingc/lxa.svg)

## Get started

### Install with NPM or Yarn

- With NPM
  ```
  $ npm install lxa --save
  ```

- With Yarn

  ```
  $ yarn add lxa
  ```

### Quick starting example

Let's get started by generating a regular expression checker, testing whether a string is of the language of `/(a|b)*cd?/` using *lxa*.

> Tips: You will see there are concepts of *NFAs* and *DFAs* in the example code. Don't be worried about that since using *lxa* does not require the prerequisite knowledge of [NFAs (Non-deterministic Finite Automata)](https://en.wikipedia.org/wiki/Nondeterministic_finite_automaton) and [DFAs (Deterministic Finite Automata)](https://en.wikipedia.org/wiki/Deterministic_finite_automaton). It's not hard for you to build your own lexical analyzer or regular expression tools following this guide. Understanding those concepts helps you acquire a deeper understanding of the *lxa*'s principle though.

The expression of `(a|b)*cd?` consists of three parts, which also consist of smaller units, and so on. The following describes all the parts of the entire expression.

The entire expression is the concatenation of the following three expressions

- `(a|b)*`

  - which is the closure of `(a|b)`

    - which is the union of `a` and `b`

- A single character of `c`

- `d?`

  - The concatenation of single character `d` and empty string (We mark empty string as `ε` (epsilon)

1. First, we need to create *states* for each part of the expression and combine them together.

    ```ts
    import { stateOps, epsilon } from 'lxa';
    const {  SingleInputState,  UnionState, ClosureState } = stateOps;

    // state for single character 'a' and 'b'
    const state_for_a = new SingleInputState('a');
    const state_for_b = new SingleInputState('b');

    // and generate the union of 'a' and 'b', (a|b)
    const union_of_a_and_b = new UnionState(a, b);

    // and then the closure `(a|b)*`
    const union_of_a_and_b_closure = new ClosureState(union_of_a_and_b);

    // and concatenate `(a|b)*` with c
    const concat_with_c = new ConcatState(union_of_a_and_b_closure, new SingleInputState('c'));

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
    const final = new ConcatState(concat_with_c, d_or_empty);
    ```
2. Generate a DFA for testing.

    ```ts
    import { NFA } from 'lxa';
    const dfa = new NFA(final).toDFA();

    dfa.test('aaac'); // true
    dfa.test('abcd') // true
    dfa.test('bbbcd') // true
    dfa.test('ad') // false
    ```
It is verbose to union or concatenate multiple states because we need to nest those states in a very deep hierarchy, especially when the expression is complicated. We have provided you with two util functions [`concatMultipleStates()`](#concatmultiplestates), [`unionMultipleStates()`](#unionmultiplestates) to union or concatenate multiple states such that we don't have to nest them all.

```ts
import { concatMultipleStates } from 'lxa';

// This is much concise
const final = concatMultipleStates(
  union_of_a_and_b_closure, 
  new SingleInputState('c'),
  d_or_empty
);
```

## APIs

### `epsilon`

`epsilon` is a singleton object representing an empty string. It can be used as the argument for `input` of the `StateOp`'s constructor.

### `stateOps`

#### `stateOps.StateOp`

This is the base class. Please do not instantiate it explicitly. You can use it as a type notation for TypeScript. The following classes are subclasses of `StateOp`.

#### `stateOps.SingleInputState `

`constructor SingleInputState(input: InputType, accepted?: boolean): SingleInputState`

- `inputType` is either a `string` type or the [`epsilon`](#epsilon) object
- `accepted` indicates whether the current state is accepted or not. If the current state is accepted and there is no more input string, the whole regular expression is accepted. Refer to the the explanation for *NFAs* and *DFAs* for more details about the *accepted* state. Default to `false`.

#### `stateOps.ConcatState`

`constructor ConcatState(a: StateOp, b: StateOp): ConcatState`

Concatenates two states. Use [`concatMultipleStates()`](#concatmultiplestates) for a shorthand of concatenating more states.

#### `stateOps.UnionState`

`constructor UnionState(a: StateOp, b: StateOp, accepted?: boolean): UnionState`

Unions two states. Use Use [`unionMultipleStates()`](#unionmultiplestates) for a shorthand of uniting more states.

- `accepted`, ditto

#### `stateOps.ClosureState`

`constructor ClosureState(a: StateOp, accepted?: boolean): ClosureState`

Generates the closure of a state.

- `a` is the input state to use to generate the closure
- `accepted`, ditto

### `concatMultipleStates`

`function concatMultipleStates(...states: StateOp[]): StateOp`

Concatenates multiple states together. Shorthand for nesting constructors of `stateOps.ConcatState`

### `unionMultipleStates`

`function unionMultipleStates({states, accepted}): StateOp`

Unites multiple states together. Shorthand for nesting constructors of `stateOps.UnionState`

- `states` is an array of `StateOp` instances
- `accepted`, ditto

### `NFA`

#### `NFA constructor`

`constructor NFA(state: StateOp): NFA`

#### `NFA.prototype.toDFA`

`NFA.prototype.toDFA.toDFA(): DFA`

Returns a `DFA` instance generating from the `NFA` instance caller

### `DFA`

#### `DFA.prototype.test`

`DFA.prototype.test(input: string): boolean`

Checks if the input string is of the expression language

## License

Under the [MIT License](https://github.com/yuqingc/lxa/blob/master/LICENSE).

Support [![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
