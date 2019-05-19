"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var epsilon_1 = __importDefault(require("./epsilon"));
var State = /** @class */ (function () {
    function State(accepted, alias) {
        if (accepted === void 0) { accepted = false; }
        if (alias === void 0) { alias = ''; }
        this.accepted = accepted;
        this.alias = alias;
        this.nextStatesMap = new Map();
    }
    State.prototype.setNext = function (input, state) {
        if (!this.nextStatesMap.has(input)) {
            this.nextStatesMap.set(input, new Set());
        }
        // This has to be type checking, trick for compiler
        var nextStates = this.nextStatesMap.get(input);
        if (nextStates) {
            nextStates.add(state);
        }
    };
    State.prototype.isAccepted = function () {
        return this.accepted;
    };
    State.prototype.epsilonClosure = function () {
        var e_1, _a;
        var epsilonSet = new Set();
        epsilonSet.add(this);
        var epsilonStates = this.nextStatesMap.get(epsilon_1.default);
        if (epsilonStates) {
            utils_1.mergeSetInto(epsilonSet, epsilonStates);
            try {
                for (var epsilonStates_1 = __values(epsilonStates), epsilonStates_1_1 = epsilonStates_1.next(); !epsilonStates_1_1.done; epsilonStates_1_1 = epsilonStates_1.next()) {
                    var state = epsilonStates_1_1.value;
                    utils_1.mergeSetInto(epsilonSet, state.epsilonClosure());
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (epsilonStates_1_1 && !epsilonStates_1_1.done && (_a = epsilonStates_1.return)) _a.call(epsilonStates_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return epsilonSet;
    };
    return State;
}());
exports.State = State;
