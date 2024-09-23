// src/core/render.ts
import { VNode } from './vdom';

function renderTextNode(vnode: string | number, container: HTMLElement): Text {
  const textNode = document.createTextNode(vnode.toString());
  container.appendChild(textNode);
  return textNode;
}

function setElementProps(domElement: HTMLElement, props: Record<string, any>): void {
  Object.entries(props).forEach(([key, value]) => {
    if (key !== 'children') {
      domElement.setAttribute(key, value);
    }
  });
}

function renderElementNode(vnode: VNode, container: HTMLElement): HTMLElement {
  const domElement = document.createElement(vnode.type as string);

  // Set element properties
  setElementProps(domElement, vnode.props);

  // Render and append children
  vnode.children.forEach(child => {
    const childNode = render(child, domElement);
    domElement.appendChild(childNode);
  });

  container.appendChild(domElement);
  return domElement;
}

function renderComponentNode(vnode: VNode, container: HTMLElement): Node {
  const component = vnode.type as Function;
  const childVNode = component(vnode.props);
  return render(childVNode, container);
}

export function render(vnode: VNode | string | number, container: HTMLElement): Node {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return renderTextNode(vnode, container);
  }

  if (Array.isArray(vnode)) {
    vnode.forEach(child => render(child, container));  // Recursively render each child
    return container;  // Return container as a Node after all children are rendered
  }

  if (typeof vnode.type === 'string') {
    return renderElementNode(vnode, container);
  }

  if (typeof vnode.type === 'function') {
    return renderComponentNode(vnode, container);
  }

  throw new Error(`Invalid VNode type: ${typeof vnode.type}`);
}
