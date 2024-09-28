// src/index.ts
export type { VNode, VNodeType, Fragment } from './core/vdom';
export { createElement, createTextElement } from './core/vdom';
export { render } from './core/render';
export { diff } from './core/diff';
export  type { Patch } from './core/diff';
export { patch } from './core/patch';
export { createRoot } from './core/dom';
export { currentRoot } from './shared/dom-state';
export { useState } from './hooks/useState'
export { useEffect } from './hooks/useEffect'
export { RouterProvider,redirect } from './router/RouterProvider'
export type { Route } from './router/RouterProvider'
export { navigate } from './router/navigate'