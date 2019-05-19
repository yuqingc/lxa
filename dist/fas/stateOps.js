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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./state");
var epsilon_1 = __importDefault(require("./epsilon"));
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
        _this.start = new state_1.State();
        _this.end = new state_1.State(accepted);
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
        _this.a.setNext(epsilon_1.default, _this.b);
        _this.end = _this.b.getEndState();
        return _this;
    }
    return ConcatState;
}(StateOp));
exports.ConcatState = ConcatState;
var UnionState = /** @class */ (function (_super) {
    __extends(UnionState, _super);
    function UnionState(a, b, accepted) {
        var e_1, _a;
        if (accepted === void 0) { accepted = false; }
        var _this = _super.call(this) || this;
        _this.a = a;
        _this.b = b;
        _this.start = new state_1.State();
        _this.end = new state_1.State(accepted);
        try {
            for (var _b = __values([_this.a, _this.b]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var arg = _c.value;
                var argOpStart = arg.getStartState();
                var argOpEnd = arg.getEndState();
                if (argOpStart) {
                    _this.start.setNext(epsilon_1.default, argOpStart);
                }
                else {
                    throw new Error('start of argOp is null');
                }
                if (argOpEnd) {
                    argOpEnd.setNext(epsilon_1.default, _this.end);
                }
                else {
                    throw new Error('end of argOp is null');
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
        _this.start = new state_1.State();
        _this.end = new state_1.State(accepted);
        var aStart = _this.a.getStartState();
        var aEnd = _this.a.getEndState();
        if (aStart) {
            _this.start.setNext(epsilon_1.default, aStart);
        }
        else {
            throw new Error('start of a is null');
        }
        _this.start.setNext(epsilon_1.default, _this.end);
        if (aEnd) {
            aEnd.setNext(epsilon_1.default, _this.end);
            aEnd.setNext(epsilon_1.default, _this.start);
        }
        return _this;
    }
    return ClosureState;
}(StateOp));
exports.ClosureState = ClosureState;
