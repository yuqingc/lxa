"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stateOps_1 = require("./stateOps");
function concatMultipleStates() {
    var states = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        states[_i] = arguments[_i];
    }
    if (states.length === 0) {
        throw new Error('Argument must be at least one state');
    }
    if (states.length === 1) {
        return states[0];
    }
    return states.reduce(function (stateA, stateB) {
        return new stateOps_1.ConcatState(stateA, stateB);
    });
}
exports.concatMultipleStates = concatMultipleStates;
function unionMultipleStates(_a) {
    var states = _a.states, _b = _a.accepted, accepted = _b === void 0 ? false : _b;
    if (states.length === 0) {
        throw new Error('Argument must be at least one state');
    }
    if (states.length === 1) {
        return states[0];
    }
    return states.reduce(function (stateA, stateB, currentIndex) {
        return new stateOps_1.UnionState(stateA, stateB, (currentIndex === states.length - 1) && accepted);
    });
}
exports.unionMultipleStates = unionMultipleStates;
