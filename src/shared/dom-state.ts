import type { Root } from "../core/dom";

export let currentRoot: Root | null = null;

export function setCurrentRoot(root: Root | null) {
    currentRoot = root;
}