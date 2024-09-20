import type { Root } from "../core/dom";

export let currentRoot: Root | null = null;
export let states: any[] = [];
export let stateIndex = 0;

export function setCurrentRoot(root: Root | null) {
    currentRoot = root;
}

export function resetState() {
    stateIndex = 0;
}

export function addNewState():number {
    return stateIndex++;
}
