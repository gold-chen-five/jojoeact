// src/core/diff.ts
import type { VNode } from './vdom';

export type Patch = 
  | { type: "REPLACE"; newVNode: VNode }
  | { type: "TEXT"; newVNode: VNode }
  | { 
      type: "PATCH"; 
      propPatches: { [key: string]: any }; 
      childPatches: (Patch | null)[];
      additionalPatches: { type: "ADD"; newVNode: VNode }[];
    };

export function diff(oldVNode: VNode, newVNode: VNode): Patch | null {
   // 如果節點類型不同，直接替換
  if (oldVNode.type !== newVNode.type) {
    return { type: "REPLACE", newVNode };
  }

  if (
    oldVNode.type === "TEXT_ELEMENT" &&
    oldVNode.props.nodeValue !== newVNode.props.nodeValue
  ) {
    return { type: "TEXT", newVNode };
  }

   // 比較屬性的變化
  const propPatches: { [key: string]: any } = {};
  console.log(newVNode);
  for (const [key, value] of Object.entries(newVNode.props)) {
    if (value !== oldVNode.props[key]) {
      propPatches[key] = value;
    }
  }
  for (const key in oldVNode.props) {
    if (!(key in newVNode.props)) {
      propPatches[key] = null;
    }
  }

  // 比較子節點
  const childPatches: (Patch | null)[] = [];
  const additionalPatches: { type: "ADD"; newVNode: VNode }[] = [];
  oldVNode.children.forEach((oldChild, i) => {
    if (
      (typeof oldChild === "string" && typeof newVNode.children[i] === "string") ||
      (typeof oldChild === "number" && typeof newVNode.children[i] === "number")
    ) {
      if (oldChild !== newVNode.children[i]) {
        childPatches.push({ type: "TEXT",  newVNode: { type: "TEXT_ELEMENT", props: { nodeValue: newVNode.children[i].toString() }, children: [] } as VNode  });
      }
    }
    
    if (
      (typeof oldChild !== "string" && typeof newVNode.children[i] !== "string") ||
      (typeof oldChild !== "number" && typeof newVNode.children[i] !== "number")
    ) {
      childPatches.push(diff(oldChild as VNode, newVNode.children[i] as VNode));
    }

  });
  for (let i = oldVNode.children.length; i < newVNode.children.length; i++) {
    additionalPatches.push({ type: "ADD", newVNode: newVNode.children[i] as VNode });
  }

  if (
    Object.keys(propPatches).length === 0 &&
    childPatches.every(patch => patch === null) &&
    additionalPatches.length === 0
  ) {
    return null;
  }

  return {
    type: "PATCH",
    propPatches,
    childPatches,
    additionalPatches
  };
}