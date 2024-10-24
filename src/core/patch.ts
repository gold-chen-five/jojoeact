// src/core/patch.ts
import { render } from './render';
import { Patch, ReplacePatch, TextPatch, PatchPatch, ArrayPatch } from './diff';

export function patch(dom: Node, patchObj: Patch | null): Node {
  if (!dom || !patchObj) return dom;
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

function updateTextNode(dom: Node, patchObj: TextPatch): Node {
  (dom as Text).nodeValue = patchObj.newVNode.props.nodeValue;
  return dom;
}

function applyArrayChildPatches(dom: Node, patchObj: ArrayPatch): void {
  patchObj.childPatches.forEach((childPatch) => {
    patch(dom, childPatch);
  });
}

function applyPropPatches(dom: Node, patchObj: PatchPatch): void {
  for (const [key, value] of Object.entries(patchObj.propPatches)) {
    if (value === null) {
      (dom as Element).removeAttribute(key);
    } else {
      (dom as Element).setAttribute(key, value);
    }
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
