import { currentRoot } from "../shared/dom-state";

export function useState<T>(initialValue: T): [T, (newValue: T) => void] {
    let state = initialValue;

  function setState(newValue: T) {
    state = newValue;
    currentRoot?.updateApp(); // Trigger re-render on state change
  }

  return [state, setState];
}