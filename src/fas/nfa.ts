import { StateOp } from './stateOps';
import { DFAStatesSet, DFA } from './dfa';

export class NFA {
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