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
Object.defineProperty(exports, "__esModule", { value: true });
// merge sourceSet into targetSet
function mergeSetInto(targetSet, sourceSet) {
    var e_1, _a;
    try {
        for (var sourceSet_1 = __values(sourceSet), sourceSet_1_1 = sourceSet_1.next(); !sourceSet_1_1.done; sourceSet_1_1 = sourceSet_1.next()) {
            var item = sourceSet_1_1.value;
            targetSet.add(item);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (sourceSet_1_1 && !sourceSet_1_1.done && (_a = sourceSet_1.return)) _a.call(sourceSet_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return targetSet;
}
exports.mergeSetInto = mergeSetInto;
function eqSet(as, bs) {
    var e_2, _a;
    if (as.size !== bs.size)
        return false;
    try {
        for (var as_1 = __values(as), as_1_1 = as_1.next(); !as_1_1.done; as_1_1 = as_1.next()) {
            var a = as_1_1.value;
            if (!bs.has(a))
                return false;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (as_1_1 && !as_1_1.done && (_a = as_1.return)) _a.call(as_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return true;
}
exports.eqSet = eqSet;
function setHasSet(container, inputSet) {
    var e_3, _a;
    try {
        for (var container_1 = __values(container), container_1_1 = container_1.next(); !container_1_1.done; container_1_1 = container_1.next()) {
            var setItem = container_1_1.value;
            if (eqSet(setItem, inputSet)) {
                return true;
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (container_1_1 && !container_1_1.done && (_a = container_1.return)) _a.call(container_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return false;
}
exports.setHasSet = setHasSet;
