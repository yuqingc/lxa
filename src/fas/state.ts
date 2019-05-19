import { mergeSetInto } from '../utils';
import epsilon, { Epsilon } from './epsilon';

export type InputType = string | Epsilon;

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
