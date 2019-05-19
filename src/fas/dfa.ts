import { State } from './state';
import { eqSet, mergeSetInto } from '../utils';
import { Epsilon } from './epsilon';


export class DFAStatesSet {
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

export class DFA {
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
