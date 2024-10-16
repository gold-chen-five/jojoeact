import { currentRoot } from "../shared/dom-state";

/**
 * this global state is to manage all useState's states
 * when every function execute ,whether inside the function have useState hook,
 * it store to this global state, stateIndex will ++   
 * when execute currentRoot.updateApp() will trigger resetStateIndex.
 */
let states: any[] = [];
let stateIndex: number = 0;
function increaseStateIndex(): void {
  stateIndex++;
}

export function resetStates(): void {
  states = [];
  resetStateIndex();
}

export function resetStateIndex(): void {
  stateIndex = 0;
}

/**
 * @description setState will trigger currentRoot.updateApp(),currentRoot.updateApp() will cause VDom to rerender
 * @param initialValue init state
 * @returns return state ans setState
 */
export function useState<T>(initialValue: T): [T, (value: T | ((prevState: T) => T)) => void] {
  console.log(states);
  const currentIndex = stateIndex;
  increaseStateIndex();
  if (states[currentIndex] === undefined) {
    states[currentIndex] = initialValue;
  }

  function setState(value: T | ((prevState: T) => T)):void {
    let newValue = value;
    // can use an callback function to get prev value
    if(typeof value === 'function') {
      const callback = value as ((prevState: T) => T);
      newValue = callback(states[currentIndex]);
    }

    if(newValue === states[currentIndex])  return;
    states[currentIndex] = newValue;
    currentRoot?.updateApp(); // Trigger re-render on state change
  }
  return [states[currentIndex], setState];
}