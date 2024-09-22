import type { Root } from "../core/dom";

export let currentRoot: Root | null = null;
export function setCurrentRoot(root: Root | null) {
    currentRoot = root;
}

// state controll of useState
export let states: any[] = [];
export let stateIndex: number = 0; 
export function increaseStateIndex(): void {
    stateIndex++;
}
export function resetStateIndex():void {
    stateIndex = 0;
}