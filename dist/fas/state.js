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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var Epsilon = /** @class */ (function () {
    function Epsilon() {
    }
    return Epsilon;
}());
exports.Epsilon = Epsilon;
exports.epsilon = new Epsilon();
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
        var epsilonStates = this.nextStatesMap.get(exports.epsilon);
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
exports.StateOp = StateOp;
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
exports.SingleInputState = SingleInputState;
var ConcatState = /** @class */ (function (_super) {
    __extends(ConcatState, _super);
    function ConcatState(a, b) {
        var _this = _super.call(this) || this;
        _this.a = a;
        _this.b = b;
        _this.start = _this.a.getStartState();
        _this.a.setNext(exports.epsilon, _this.b);
        _this.end = _this.b.getEndState();
        return _this;
    }
    return ConcatState;
}(StateOp));
exports.ConcatState = ConcatState;
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
                    _this.start.setNext(exports.epsilon, argOpStart);
                }
                else {
                    throw new Error('start of argOp is null');
                }
                if (argOpEnd) {
                    argOpEnd.setNext(exports.epsilon, _this.end);
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
exports.UnionState = UnionState;
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
            _this.start.setNext(exports.epsilon, aStart);
        }
        else {
            throw new Error('start of a is null');
        }
        _this.start.setNext(exports.epsilon, _this.end);
        if (aEnd) {
            aEnd.setNext(exports.epsilon, _this.end);
            aEnd.setNext(exports.epsilon, _this.start);
        }
        return _this;
    }
    return ClosureState;
}(StateOp));
exports.ClosureState = ClosureState;
