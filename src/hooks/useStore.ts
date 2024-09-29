/**
 * useStore is similar to zustand useStore
 * under the hood: use listener、subscribe、set to control state store
 */

/**
 * @description create a store
 * @param initStore init store can have state and action
 * @returns return store object
 */
function create<T>(initStore: T):() => T {
    return () => initStore;
}