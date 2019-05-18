// merge sourceSet into targetSet
export function mergeSetInto<T>(targetSet: Set<T>, sourceSet: Set<T>) {
  for (const item of sourceSet) {
    targetSet.add(item);
  }
  return targetSet;
}

export function eqSet<T>(as: Set<T>, bs: Set<T>) {
  if (as.size !== bs.size) return false;
  for (var a of as) if (!bs.has(a)) return false;
  return true;
}

export function setHasSet<T>(container: Set<Set<T>>, inputSet: Set<T>) {
  for (const setItem of container) {
    if (eqSet(setItem, inputSet)) {
      return true;
    }
  }
  return false;
}