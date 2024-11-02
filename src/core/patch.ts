// src/core/patch.ts
import { render } from './render';
import { Patch, ReplacePatch, TextPatch, PatchPatch, ArrayPatch } from './diff';

export function patch(dom: Node, patchObj: Patch | null): Node | undefined {
  if ( !patchObj) return dom;
  switch (patchObj.type) {
    case "REMOVE":
      return removeNode(dom);
    case "REPLACE":
      return replaceNode(dom, patchObj);
    case "TEXT":
      return updateTextNode(dom, patchObj);
    case "ARRAY":
      applyArrayChildPatches(dom, patchObj);
      applyAdditionalPatches(dom, patchObj);
      break;
    case "PATCH":
      applyPropPatches(dom, patchObj);
      applyChildPatches(dom, patchObj);
      applyAdditionalPatches(dom, patchObj);
      break;
  }

  return dom;
}

function removeNode(dom: Node): Node {
  if(!dom || !dom.parentNode) return dom;
  return dom.parentNode.removeChild(dom);
}

function replaceNode(dom: Node, patchObj: ReplacePatch): Node {
  const newDOM = render(patchObj.newVNode, document.createElement(`${patchObj.newVNode.type}`));
  dom.parentNode!.replaceChild(newDOM, dom);
  return newDOM;
}

function updateTextNode(dom: Node | undefined, patchObj: TextPatch): Node | undefined{
  if(!dom)  return dom;
  (dom as Text).nodeValue = patchObj.newVNode.props.nodeValue ?? "";
  return dom;
}

function applyArrayChildPatches(dom: Node, patchObj: ArrayPatch): void {
  patchObj.childPatches.forEach((childPatch) => {
    patch(dom, childPatch);
  });
}

// use weak map to store event listener
// check if event listener have be create, remove it when the new event listner function is different
const eventListeners = new WeakMap<Element, Map<string, EventListener>>();

function applyPropPatches(dom: Node, patchObj: PatchPatch): void {
  const element = dom as Element;

  for (const [key, value] of Object.entries(patchObj.propPatches)) {
    // (dom as Element).setAttribute(key, value);
    if (key === 'children') continue;

    if (key.startsWith('on')) {
      const eventType = key.slice(2).toLowerCase();
      const newListener = typeof value === 'function' ? value : null;
      updateEventListener(element, eventType, newListener);
    } else {
      updateAttribute(element, key, value);
    }
  }
}

function updateEventListener(element: Element, eventType: string, newListener: EventListener | null) {
  const listenerMap = eventListeners.get(element) || new Map<string, EventListener>();

  const existingListener = listenerMap.get(eventType);
  if (existingListener) {
    element.removeEventListener(eventType, existingListener);
  }

  if (newListener) {
    element.addEventListener(eventType, newListener);
    listenerMap.set(eventType, newListener);
    eventListeners.set(element, listenerMap);
  } else {
    listenerMap.delete(eventType);
    if (listenerMap.size === 0) {
      eventListeners.delete(element);
    }
  }
}

function updateAttribute(element: Element, key: string, value: any) {
  if (value === null) {
    element.removeAttribute(key);
  } else {
    element.setAttribute(key, value);
  }
}

function applyChildPatches(dom: Node, patchObj: PatchPatch): void {
  let offset = 0;
  patchObj.childPatches.forEach((childPatch, i) => {
    if(childPatch?.type === "ARRAY") {
      patch(dom, childPatch);
    } else if (childPatch?.type === "REMOVE") {
      patch(dom.childNodes[i - offset], childPatch);
      offset++;
    } else {
      patch(dom.childNodes[i - offset], childPatch);
    }
  });
}

function applyAdditionalPatches(dom: Node, patchObj: PatchPatch | ArrayPatch): void {
  patchObj.additionalPatches.forEach(additionalPatch => {
    const newChildDOM = render(additionalPatch.newVNode, document.createElement(`${additionalPatch.newVNode.type}`));
    dom.appendChild(newChildDOM);
  });
}
