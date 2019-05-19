import { Epsilon } from './epsilon';
export declare type InputType = string | Epsilon;
export declare class State {
    nextStatesMap: Map<InputType, Set<State>>;
    private accepted;
    alias: string;
    constructor(accepted?: boolean, alias?: string);
    setNext(input: InputType, state: State): void;
    isAccepted(): boolean;
    epsilonClosure(): Set<State>;
}
