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
        var e_1, _a;
        try {
            for (var _b = __values(this.states), _c = _b.next(); !_c.done; _c = _b.next()) {
                var state = _c.value;
                if (state.isAccepted()) {
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    DFAStatesSet.prototype.extractDFAStatesSetFromDFAStatesSets = function (dfaStatesSets, stateSet) {
        var e_2, _a;
        try {
            for (var dfaStatesSets_1 = __values(dfaStatesSets), dfaStatesSets_1_1 = dfaStatesSets_1.next(); !dfaStatesSets_1_1.done; dfaStatesSets_1_1 = dfaStatesSets_1.next()) {
                var testDFAStatesSet = dfaStatesSets_1_1.value;
                if (utils_1.eqSet(testDFAStatesSet.states, stateSet)) {
                    return testDFAStatesSet;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (dfaStatesSets_1_1 && !dfaStatesSets_1_1.done && (_a = dfaStatesSets_1.return)) _a.call(dfaStatesSets_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    // TODO: may be bugs here
    DFAStatesSet.prototype.autoSetNext = function (origin) {
        var e_3, _a;
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
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (nextStatesMap_1_1 && !nextStatesMap_1_1.done && (_a = nextStatesMap_1.return)) _a.call(nextStatesMap_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    DFAStatesSet.prototype.getNextStatesSetMap = function () {
        var e_4, _a, e_5, _b, e_6, _c;
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
                            catch (e_6_1) { e_6 = { error: e_6_1 }; }
                            finally {
                                try {
                                    if (nextStates_1_1 && !nextStates_1_1.done && (_c = nextStates_1.return)) _c.call(nextStates_1);
                                }
                                finally { if (e_6) throw e_6.error; }
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
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return nextStatesMap;
    };
    return DFAStatesSet;
}());
exports.DFAStatesSet = DFAStatesSet;
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
exports.DFA = DFA;
