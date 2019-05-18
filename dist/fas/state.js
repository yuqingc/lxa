"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var Epsilon = /** @class */ (function () {
    function Epsilon() {
    }
    return Epsilon;
}());
var epsilon = new Epsilon();
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
        var epsilonStates = this.nextStatesMap.get(epsilon);
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
var StateOp = /** @class */ (function () {
    function StateOp() {
        this.start = null;
        this.end = null;
    }
    StateOp.prototype.getStartState = function () {
        return this.start;
    };
    StateOp.prototype.getEndState = function () {
        return this.end;
    };
    StateOp.prototype.setNext = function (input, state) {
        var start = state.getStartState();
        if (start && this.end) {
            this.end.setNext(input, start);
        }
        else if (!start) {
            throw new Error('Start state of param state is null');
        }
        else if (!this.end) {
            throw new Error('this.end is null');
        }
    };
    return StateOp;
}());
var SingleInputState = /** @class */ (function (_super) {
    __extends(SingleInputState, _super);
    function SingleInputState(input, accepted) {
        if (accepted === void 0) { accepted = false; }
        var _this = _super.call(this) || this;
        _this.start = new State();
        _this.end = new State(accepted);
        _this.start.setNext(input, _this.end);
        return _this;
    }
    return SingleInputState;
}(StateOp));
var ConcatState = /** @class */ (function (_super) {
    __extends(ConcatState, _super);
    function ConcatState(a, b) {
        var _this = _super.call(this) || this;
        _this.a = a;
        _this.b = b;
        _this.start = _this.a.getStartState();
        _this.a.setNext(epsilon, _this.b);
        _this.end = _this.b.getEndState();
        return _this;
    }
    return ConcatState;
}(StateOp));
var UnionState = /** @class */ (function (_super) {
    __extends(UnionState, _super);
    function UnionState(a, b, accepted) {
        var e_2, _a;
        if (accepted === void 0) { accepted = false; }
        var _this = _super.call(this) || this;
        _this.a = a;
        _this.b = b;
        _this.start = new State();
        _this.end = new State(accepted);
        try {
            for (var _b = __values([_this.a, _this.b]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var arg = _c.value;
                var argOpStart = arg.getStartState();
                var argOpEnd = arg.getEndState();
                if (argOpStart) {
                    _this.start.setNext(epsilon, argOpStart);
                }
                else {
                    throw new Error('start of argOp is null');
                }
                if (argOpEnd) {
                    argOpEnd.setNext(epsilon, _this.end);
                }
                else {
                    throw new Error('end of argOp is null');
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return _this;
    }
    return UnionState;
}(StateOp));
var ClosureState = /** @class */ (function (_super) {
    __extends(ClosureState, _super);
    function ClosureState(a, accepted) {
        if (accepted === void 0) { accepted = false; }
        var _this = _super.call(this) || this;
        _this.a = a;
        _this.start = new State();
        _this.end = new State(accepted);
        var aStart = _this.a.getStartState();
        var aEnd = _this.a.getEndState();
        if (aStart) {
            _this.start.setNext(epsilon, aStart);
        }
        else {
            throw new Error('start of a is null');
        }
        _this.start.setNext(epsilon, _this.end);
        if (aEnd) {
            aEnd.setNext(epsilon, _this.end);
            aEnd.setNext(epsilon, _this.start);
        }
        return _this;
    }
    return ClosureState;
}(StateOp));
var DFAStatesSet = /** @class */ (function () {
    function DFAStatesSet(states) {
        this.states = states;
        this.nextStatesSetMap = new Map();
        this.origin = null;
        // this.alreadyGeneratedSets = new Set();
        this.alreadyGeneratedDFAStateSets = new Set();
    }
    DFAStatesSet.prototype.makeOrigin = function () {
        this.origin = this;
        return this;
    };
    DFAStatesSet.prototype.setOrigin = function (origin) {
        this.origin = origin;
        return this;
    };
    DFAStatesSet.prototype.getOrigin = function () {
        if (this.origin) {
            return this.origin;
        }
        else {
            throw new Error('`origin `is not set. Try using the setOrigin() method');
        }
    };
    DFAStatesSet.prototype.setNext = function (input, dfaStates) {
        this.nextStatesSetMap.set(input, dfaStates);
    };
    DFAStatesSet.prototype.getNext = function (input) {
        return this.nextStatesSetMap.get(input);
    };
    DFAStatesSet.prototype.isAccepted = function () {
        var e_3, _a;
        try {
            for (var _b = __values(this.states), _c = _b.next(); !_c.done; _c = _b.next()) {
                var state = _c.value;
                if (state.isAccepted()) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    DFAStatesSet.prototype.extractDFAStatesSetFromDFAStatesSets = function (dfaStatesSets, stateSet) {
        var e_4, _a;
        try {
            for (var dfaStatesSets_1 = __values(dfaStatesSets), dfaStatesSets_1_1 = dfaStatesSets_1.next(); !dfaStatesSets_1_1.done; dfaStatesSets_1_1 = dfaStatesSets_1.next()) {
                var testDFAStatesSet = dfaStatesSets_1_1.value;
                if (utils_1.eqSet(testDFAStatesSet.states, stateSet)) {
                    return testDFAStatesSet;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (dfaStatesSets_1_1 && !dfaStatesSets_1_1.done && (_a = dfaStatesSets_1.return)) _a.call(dfaStatesSets_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    // TODO: may be bugs here
    DFAStatesSet.prototype.autoSetNext = function (origin) {
        var e_5, _a;
        this.getOrigin().alreadyGeneratedDFAStateSets.add(this);
        var nextStatesMap = this.getNextStatesSetMap();
        try {
            for (var nextStatesMap_1 = __values(nextStatesMap), nextStatesMap_1_1 = nextStatesMap_1.next(); !nextStatesMap_1_1.done; nextStatesMap_1_1 = nextStatesMap_1.next()) {
                var _b = __read(nextStatesMap_1_1.value, 2), input = _b[0], states = _b[1];
                var extractedDFAStatesSet = this.extractDFAStatesSetFromDFAStatesSets(this.getOrigin().alreadyGeneratedDFAStateSets, states);
                if (!extractedDFAStatesSet) {
                    var nextDFAStatesSet = new DFAStatesSet(states).setOrigin(origin);
                    this.setNext(input, nextDFAStatesSet);
                    nextDFAStatesSet.autoSetNext(origin);
                }
                else if (!this.getNext(input)) {
                    this.setNext(input, extractedDFAStatesSet);
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (nextStatesMap_1_1 && !nextStatesMap_1_1.done && (_a = nextStatesMap_1.return)) _a.call(nextStatesMap_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    DFAStatesSet.prototype.getNextStatesSetMap = function () {
        var e_6, _a, e_7, _b, e_8, _c;
        var nextStatesMap = new Map();
        try {
            for (var _d = __values(this.states), _e = _d.next(); !_e.done; _e = _d.next()) {
                var state = _e.value;
                try {
                    for (var _f = __values(state.nextStatesMap), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var _h = __read(_g.value, 2), input = _h[0], nextStates = _h[1];
                        if (typeof input === 'string') {
                            var nextStatesEpsilonClosure = new Set();
                            try {
                                for (var nextStates_1 = __values(nextStates), nextStates_1_1 = nextStates_1.next(); !nextStates_1_1.done; nextStates_1_1 = nextStates_1.next()) {
                                    var state_1 = nextStates_1_1.value;
                                    utils_1.mergeSetInto(nextStatesEpsilonClosure, state_1.epsilonClosure());
                                }
                            }
                            catch (e_8_1) { e_8 = { error: e_8_1 }; }
                            finally {
                                try {
                                    if (nextStates_1_1 && !nextStates_1_1.done && (_c = nextStates_1.return)) _c.call(nextStates_1);
                                }
                                finally { if (e_8) throw e_8.error; }
                            }
                            var statesSetFromNextStateMap = nextStatesMap.get(input);
                            if (statesSetFromNextStateMap) {
                                utils_1.mergeSetInto(statesSetFromNextStateMap, nextStatesEpsilonClosure);
                            }
                            else {
                                nextStatesMap.set(input, nextStatesEpsilonClosure);
                            }
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return nextStatesMap;
    };
    return DFAStatesSet;
}());
var DFA = /** @class */ (function () {
    function DFA(statesSet) {
        this.statesSet = statesSet;
    }
    DFA.prototype.test = function (input) {
        var currentStatesSet = this.statesSet;
        var inputStream = input.split('');
        while (inputStream.length > 0) {
            var inputChar = inputStream.shift();
            var tryNextStatesSet = currentStatesSet.getNext(inputChar);
            if (tryNextStatesSet) {
                currentStatesSet = tryNextStatesSet;
            }
            else {
                return false;
            }
        }
        return currentStatesSet.isAccepted();
    };
    return DFA;
}());
var NFA = /** @class */ (function () {
    function NFA(state) {
        this.stateOp = state;
    }
    NFA.prototype.toDFA = function () {
        var startState = this.stateOp.getStartState();
        if (startState) {
            var startStatesSet = startState.epsilonClosure();
            var startDFASet = new DFAStatesSet(startStatesSet).makeOrigin();
            startDFASet.autoSetNext(startDFASet);
            return new DFA(startDFASet);
        }
        else {
            throw new Error('toDFA failed. Start state is not set');
        }
    };
    return NFA;
}());
// (1|0)*1
var one = new SingleInputState('1');
var zero = new SingleInputState('0');
var oneOrZero = new UnionState(one, zero);
var oneOrZeroStar = new ClosureState(oneOrZero);
var final = new ConcatState(oneOrZeroStar, new SingleInputState('1', true));
var dfa = new NFA(final).toDFA();
console.log(dfa.test('1'));
console.log('-------------', dfa.test('00000000001'));
console.log('-------------', dfa.test('10101010000101'));
console.log('-------------', dfa.test('01010011000101011'));
console.log('-------------', dfa.test('010100110001010110'));
console.log('-------------', dfa.test(''));
console.log('-------------', dfa.test('0000000000000000'));
console.log('-------------', dfa.test('11111111111'));
