import { StateOp } from './stateOps';
export declare function concatMultipleStates(...states: StateOp[]): StateOp;
export declare function unionMultipleStates({ states, accepted }: {
    states: StateOp[];
    accepted?: boolean;
}): StateOp;
