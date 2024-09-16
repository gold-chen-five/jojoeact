// src/core/vdom.ts

export type VNodeType = string | Function;

export interface VNode {
  type: VNodeType;
  props: { [key: string]: any };
  children: (VNode | string)[];
}

export function createElement(type: VNodeType, props: { [key: string]: any } | null, ...children: (VNode | string)[]): VNode {
  return { type, props: props || {}, children: children || [] };
}

export function createTextElement(text: string): VNode {
  return {
    type: "TEXT_ELEMENT",
    props: { nodeValue: text },
    children: []
  };
}

export const Fragment = (props: { children: (VNode | string)[] }) => createElement(Fragment, {}, ...props.children);

// Define JSX.IntrinsicElements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any; // Allow any element type
    }
  }
}