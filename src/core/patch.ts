// src/core/patch.ts
import { render } from './render';
import { Patch } from './diff';

export function patch(dom: Node, patchObj: Patch | null): Node {
  if (!patchObj) return dom;

  if (patchObj.type === "REPLACE") {
    const newDOM = render(patchObj.newVNode, document.createElement("div"));
    dom.parentNode!.replaceChild(newDOM, dom);
    return newDOM;
  }

  if (patchObj.type === "TEXT") {
    (dom as Text).nodeValue = patchObj.newVNode.props.nodeValue;
    return dom;
  }

  if (patchObj.type === "PATCH") {
    for (const [key, value] of Object.entries(patchObj.propPatches)) {
      if (value === null) {
        (dom as Element).removeAttribute(key);
      } else {
        if (key.startsWith("on") && typeof value === "function") {
          (dom as HTMLElement & { [key: string]: any })[key] = value; // 設置為事件處理
        } else {
          (dom as Element).setAttribute(key, value);
        }
      }
    }

    patchObj.childPatches.forEach((childPatch, i) => {
      patch(dom.childNodes[i], childPatch);
    });

    patchObj.additionalPatches.forEach(additionalPatch => {
      const newChildDOM = render(additionalPatch.newVNode, document.createElement("div"));
      dom.appendChild(newChildDOM);
    });
  }

  return dom;
}