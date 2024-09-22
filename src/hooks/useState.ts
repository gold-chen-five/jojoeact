import { currentRoot } from "../shared/dom-state";
import { increaseStateIndex, states, stateIndex } from "../shared/dom-state";

export function useState<T>(initialValue: T): [T, (value: T | ((prevState: T) => T)) => void] {
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