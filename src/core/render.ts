// src/core/render.ts
import { VNode } from './vdom';

export function render(vnode: VNode | string, container: HTMLElement): Node {
  if (typeof vnode === "string") {
    const textNode = document.createTextNode(vnode);
    container.appendChild(textNode);
    return textNode;
  }

  const domElement = document.createElement(vnode.type as string);

  Object.entries(vnode.props).forEach(([prop, value]) => {
    if (prop !== "children") {
      (domElement as any)[prop] = value;
    }
  });

  vnode.children.forEach(child => {
    const childNode = render(child, domElement);
    domElement.appendChild(childNode);
  });

  container.appendChild(domElement);
  return domElement;
}