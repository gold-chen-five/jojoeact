// src/core/render.ts
import { VNode } from './vdom';

export function render(vnode: VNode | string, container: HTMLElement): Node {
  if (typeof vnode === 'string') {
    // Handle text nodes
    const textNode = document.createTextNode(vnode);
    container.appendChild(textNode);
    return textNode;
  }

  if (typeof vnode.type === 'string') {
    // Handle HTML elements
    const domElement = document.createElement(vnode.type);

    // Set properties
    Object.entries(vnode.props).forEach(([key, value]) => {
      if (key !== 'children') {
        domElement.setAttribute(key, value);
      }
    });

    // Render children
    vnode.children.forEach(child => {
      const childNode = render(child, domElement);
      domElement.appendChild(childNode);
    });

    container.appendChild(domElement);
    return domElement;
  } else if (typeof vnode.type === 'function') {
    // Handle custom components
    const component = vnode.type;
    const childVNode = component(vnode.props);
    return render(childVNode, container);
  }

  throw new Error(`Invalid VNode type: ${typeof vnode.type}`);
}