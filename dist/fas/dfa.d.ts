import { State, Epsilon } from './state';
export declare class DFAStatesSet {
    states: Set<State>;
    private nextStatesSetMap;
    alreadyGeneratedDFAStateSets: Set<DFAStatesSet>;
    private origin;
    constructor(states: Set<State>);
    makeOrigin(): this;
    setOrigin(origin: DFAStatesSet): this;
    getOrigin(): DFAStatesSet;
    setNext(input: string | Epsilon, dfaStates: DFAStatesSet): void;
    getNext(input: string | Epsilon): DFAStatesSet | undefined;
    isAccepted(): boolean;
    private extractDFAStatesSetFromDFAStatesSets;
    autoSetNext(origin: DFAStatesSet): void;
    private getNextStatesSetMap;
}
export declare class DFA {
    private statesSet;
    constructor(statesSet: DFAStatesSet);
    test(input: string): boolean;
}
