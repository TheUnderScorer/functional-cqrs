export const storeToArray = <T>(store: Set<T> | Map<any, T>): T[] =>
  Array.from(store.values());
