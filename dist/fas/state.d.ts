export declare class Epsilon {
}
export declare const epsilon: Epsilon;
declare type InputType = string | Epsilon;
export declare class State {
    nextStatesMap: Map<InputType, Set<State>>;
    private accepted;
    alias: string;
    constructor(accepted?: boolean, alias?: string);
    setNext(input: InputType, state: State): void;
    isAccepted(): boolean;
    epsilonClosure(): Set<State>;
}
export declare class StateOp {
    protected start: State | null;
    protected end: State | null;
    constructor();
    getStartState(): State | null;
    getEndState(): State | null;
    setNext(input: InputType, state: StateOp): void;
}
export declare class SingleInputState extends StateOp {
    constructor(input: InputType, accepted?: boolean);
}
export declare class ConcatState extends StateOp {
    private a;
    private b;
    constructor(a: StateOp, b: StateOp);
}
export declare class UnionState extends StateOp {
    private a;
    private b;
    constructor(a: StateOp, b: StateOp, accepted?: boolean);
}
export declare class ClosureState extends StateOp {
    private a;
    constructor(a: StateOp, accepted?: boolean);
}
export {};
