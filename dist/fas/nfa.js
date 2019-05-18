"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dfa_1 = require("./dfa");
var NFA = /** @class */ (function () {
    function NFA(state) {
        this.stateOp = state;
    }
    NFA.prototype.toDFA = function () {
        var startState = this.stateOp.getStartState();
        if (startState) {
            var startStatesSet = startState.epsilonClosure();
            var startDFASet = new dfa_1.DFAStatesSet(startStatesSet).makeOrigin();
            startDFASet.autoSetNext(startDFASet);
            return new dfa_1.DFA(startDFASet);
        }
        else {
            throw new Error('toDFA failed. Start state is not set');
        }
    };
    return NFA;
}());
exports.NFA = NFA;
