// src/core/patch.ts
import { render } from './render';
import { Patch, ReplacePatch, TextPatch, PatchPatch } from './diff';

export function patch(dom: Node, patchObj: Patch | null): Node {
  if (!patchObj) return dom;
  console.log(patchObj)
  switch (patchObj.type) {
    case "REPLACE":
      return replaceNode(dom, patchObj);
    case "TEXT":
      return updateTextNode(dom, patchObj);
    case "PATCH":
      applyPropPatches(dom, patchObj);
      applyChildPatches(dom, patchObj);
      applyAdditionalPatches(dom, patchObj);
      break;
  }

  return dom;
}

function replaceNode(dom: Node, patchObj: ReplacePatch): Node {
  const newDOM = render(patchObj.newVNode, document.createElement("div"));
  dom.parentNode!.replaceChild(newDOM, dom);
  return newDOM;
}

function updateTextNode(dom: Node, patchObj: TextPatch): Node {
  (dom as Text).nodeValue = patchObj.newVNode.props.nodeValue;
  return dom;
}

function applyPropPatches(dom: Node, patchObj: PatchPatch): void {
  for (const [key, value] of Object.entries(patchObj.propPatches)) {
    if (value === null) {
      (dom as Element).removeAttribute(key);
    } else if (key.startsWith("on") && typeof value === "function") {
      (dom as HTMLElement & { [key: string]: any })[key] = value; // Set event handler
    } else {
      (dom as Element).setAttribute(key, value);
    }
  }
}

function applyChildPatches(dom: Node, patchObj: PatchPatch): void {
  patchObj.childPatches.forEach((childPatch, i) => {
    patch(dom.childNodes[i], childPatch);
  });
}

function applyAdditionalPatches(dom: Node, patchObj: PatchPatch): void {
  patchObj.additionalPatches.forEach(additionalPatch => {
    const newChildDOM = render(additionalPatch.newVNode, document.createElement("div"));
    dom.appendChild(newChildDOM);
  });
}
