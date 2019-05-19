import { State, InputType } from './state';
import epsilon from './epsilon';

export class StateOp {
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

export class SingleInputState extends StateOp {
  constructor(input: InputType, accepted: boolean = false) {
    super();
    this.start = new State();
    this.end = new State(accepted);
    this.start.setNext(input, this.end);
  }
}


export class ConcatState extends StateOp {
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

export class UnionState extends StateOp {
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

export class ClosureState extends StateOp {
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
