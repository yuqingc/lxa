# lxa

A lexical analysis / regular expression engine written in TypeScript

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

```ts
import { stateOps, epsilon, DFA, NFA, concatMultipleStates, unionMultipleStates } from 'lxa';
const { SingleInputState } = stateOps;

// .jpe?g
test('.jpe?g work', () => {
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
```

### APIs

API documentation is under working. Feel free to check out the source code.
