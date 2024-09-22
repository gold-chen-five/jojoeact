import { currentRoot } from "../shared/dom-state";
import { increaseStateIndex, states, stateIndex } from "../shared/dom-state";

export function useState<T>(initialValue: T): [T, (newValue: T) => void] {
  const currentIndex = stateIndex;
  increaseStateIndex();
  if (states[currentIndex] === undefined) {
    states[currentIndex] = initialValue;
  }

  function setState(newValue: T):void {
    if(newValue === states[currentIndex])  return;
    states[currentIndex] = newValue;
    console.log(states[currentIndex])
    currentRoot?.updateApp(); // Trigger re-render on state change
  }
  return [states[currentIndex], setState];
}