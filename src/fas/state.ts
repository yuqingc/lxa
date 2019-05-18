import { mergeSetInto, eqSet } from '../utils';

class Epsilon {}
const epsilon = new Epsilon();

type InputType = string | Epsilon;

export class State {
  public nextStatesMap: Map<InputType, Set<State>>;
  private accepted: boolean;
  public alias: string;
  constructor(accepted: boolean = false, alias: string = '') {
    this.accepted = accepted;
    this.alias = alias;
    this.nextStatesMap = new Map();
  }

  public setNext(input: InputType, state: State) {
    if (!this.nextStatesMap.has(input)) {
      this.nextStatesMap.set(input, new Set());
    }

    // This has to be type checking, trick for compiler
    const nextStates = this.nextStatesMap.get(input);
    if (nextStates) {
      nextStates.add(state);
    }
  }

  public isAccepted() {
    return this.accepted;
  }

  public epsilonClosure() {
    const epsilonSet = new Set<State>();
    epsilonSet.add(this);
    const epsilonStates = this.nextStatesMap.get(epsilon);
    if (epsilonStates) {
      mergeSetInto(epsilonSet, epsilonStates)
      for (const state of epsilonStates) {
        mergeSetInto(epsilonSet, state.epsilonClosure())
      }
    }
    return epsilonSet;
  }
}


class StateOp {
  protected start: State | null;
  protected end: State | null;
  constructor() {
    this.start = null;
    this.end = null;
  }

  public getStartState() {
    return this.start;
  }

  public getEndState() {
    return this.end;
  }

  public setNext(input: InputType, state: StateOp) {
    const start = state.getStartState();
    if (start && this.end) {
      this.end.setNext(input, start);
    } else if (!start) {
      throw new Error('Start state of param state is null');
    } else if (!this.end) {
      throw new Error('this.end is null')
    }
  }

}

class SingleInputState extends StateOp {
  constructor(input: InputType, accepted: boolean = false) {
    super();
    this.start = new State();
    this.end = new State(accepted);
    this.start.setNext(input, this.end);
  }
}


class ConcatState extends StateOp {
  private a: StateOp;
  private b: StateOp;
  constructor(a: StateOp, b: StateOp) {
    super();
    this.a = a;
    this.b = b;
    this.start = this.a.getStartState();
    this.a.setNext(epsilon, this.b);
    this.end = this.b.getEndState();
  }
}

class UnionState extends StateOp {
  private a: StateOp;
  private b: StateOp;
  constructor(a: StateOp, b: StateOp, accepted: boolean = false) {
    super();
    this.a = a;
    this.b = b;
    this.start = new State();
    this.end = new State(accepted);
    for (const arg of [this.a, this.b]) {
      const argOpStart = arg.getStartState();
      const argOpEnd = arg.getEndState();
      if (argOpStart) {
        this.start.setNext(epsilon, argOpStart)
      } else {
        throw new Error('start of argOp is null');
      }
      if (argOpEnd) {
        argOpEnd.setNext(epsilon, this.end);
      } else {
        throw new Error('end of argOp is null')
      }
    }
  }
}

class ClosureState extends StateOp {
  private a: StateOp;
  constructor(a: StateOp, accepted: boolean = false) {
    super();
    this.a = a;
    this.start = new State();
    this.end = new State(accepted);
    const aStart = this.a.getStartState();
    const aEnd = this.a.getEndState();
    if (aStart) {
      this.start.setNext(epsilon, aStart);
    } else {
      throw new Error('start of a is null');
    }
    this.start.setNext(epsilon, this.end);
    if (aEnd) {
      aEnd.setNext(epsilon, this.end);
      aEnd.setNext(epsilon, this.start);
    }
  }
}

class DFAStatesSet {
  public states: Set<State>;
  private nextStatesSetMap: Map<string | Epsilon, DFAStatesSet>;
  // public alreadyGeneratedSets: Set<Set<State>>; // global
  public alreadyGeneratedDFAStateSets: Set<DFAStatesSet>;
  private origin: DFAStatesSet | null;
  constructor(states: Set<State>) {
    this.states = states;
    this.nextStatesSetMap = new Map();

    this.origin = null;
    // this.alreadyGeneratedSets = new Set();
    this.alreadyGeneratedDFAStateSets = new Set();
  }
  public makeOrigin() {
    this.origin = this;
    return this;
  }
  public setOrigin(origin: DFAStatesSet) {
    this.origin = origin;
    return this;
  }
  public getOrigin(): DFAStatesSet {
    if (this.origin) {
      return this.origin;
    } else {
      throw new Error('`origin `is not set. Try using the setOrigin() method');
    }
  }
  public setNext(input: string | Epsilon, dfaStates: DFAStatesSet) {
    this.nextStatesSetMap.set(input, dfaStates);
  }
  public getNext(input: string | Epsilon) {
    return this.nextStatesSetMap.get(input);
  }
  public isAccepted() {
    for (const state of this.states) {
      if (state.isAccepted()) {
        return true;
      }
    }

    return false;
  }

  private extractDFAStatesSetFromDFAStatesSets(dfaStatesSets: Set<DFAStatesSet>, stateSet: Set<State>) {
    for (const testDFAStatesSet of dfaStatesSets) {
      if (eqSet(testDFAStatesSet.states, stateSet)) {
        return testDFAStatesSet;
      }
    }
  }

  // TODO: may be bugs here
  public autoSetNext(origin: DFAStatesSet) {
    this.getOrigin().alreadyGeneratedDFAStateSets.add(this);
    const nextStatesMap = this.getNextStatesSetMap();
    for (const [input, states] of nextStatesMap) {
      const extractedDFAStatesSet = this.extractDFAStatesSetFromDFAStatesSets(this.getOrigin().alreadyGeneratedDFAStateSets, states);
      if (!extractedDFAStatesSet) {
        const nextDFAStatesSet = new DFAStatesSet(states).setOrigin(origin);
        this.setNext(input, nextDFAStatesSet);
        nextDFAStatesSet.autoSetNext(origin);
      } else if (!this.getNext(input)) {
        this.setNext(input, extractedDFAStatesSet);
      }
    }
  }

  private getNextStatesSetMap() {
    const nextStatesMap = new Map<string, Set<State>>();
    for (const state of this.states) {
      for (const [input, nextStates] of state.nextStatesMap) {
        if (typeof input === 'string') {
          const nextStatesEpsilonClosure = new Set<State>();
          for (const state of nextStates) {
            mergeSetInto(nextStatesEpsilonClosure, state.epsilonClosure());
          }
          const statesSetFromNextStateMap = nextStatesMap.get(input);
          if (statesSetFromNextStateMap) {
            mergeSetInto(statesSetFromNextStateMap, nextStatesEpsilonClosure);
          } else {
            nextStatesMap.set(input, nextStatesEpsilonClosure);
          }
        }
      }
    }
    return nextStatesMap;
  }
}

class DFA {
  private statesSet: DFAStatesSet;
  constructor(statesSet: DFAStatesSet) {
    this.statesSet = statesSet;
  }
  public test(input: string): boolean {
    let currentStatesSet = this.statesSet;
    const inputStream = input.split('');
    while (inputStream.length > 0) {
      const inputChar = inputStream.shift();
      const tryNextStatesSet = currentStatesSet.getNext(inputChar as string)
      if (tryNextStatesSet) {
        currentStatesSet = tryNextStatesSet;
      } else {
        return false;
      }
    }
    return currentStatesSet.isAccepted();
  }
}

class NFA {
  private stateOp: StateOp;
  constructor(state: StateOp) {
    this.stateOp = state;
  }
  public toDFA() {
    const startState = this.stateOp.getStartState()
    if (startState) {
      const startStatesSet = startState.epsilonClosure();
      const startDFASet = new DFAStatesSet(startStatesSet).makeOrigin();
      startDFASet.autoSetNext(startDFASet);
      return new DFA(startDFASet);
    } else {
      throw new Error('toDFA failed. Start state is not set');
    }
  }

}

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
