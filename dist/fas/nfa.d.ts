import { StateOp } from './state';
import { DFA } from './dfa';
export declare class NFA {
    private stateOp;
    constructor(state: StateOp);
    toDFA(): DFA;
}
