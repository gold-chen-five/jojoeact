// src/core/diff.ts
import type { VNode } from './vdom';

export type ReplacePatch = { type: "REPLACE"; newVNode: VNode };
export type TextPatch = { type: "TEXT"; newVNode: VNode };
export type PatchPatch = { 
  type: "PATCH"; 
  propPatches: { [key: string]: any }; 
  childPatches: (Patch | null)[];
  additionalPatches: { type: "ADD"; newVNode: VNode }[];
};

export type Patch = 
  | ReplacePatch
  | TextPatch
  | PatchPatch;

  // Main diff function
export function diff(oldVNode: VNode, newVNode: VNode): Patch | null {
  // Handle arrays of VNodes
  if (Array.isArray(oldVNode) && Array.isArray(newVNode)) {
    return diffArrays(oldVNode, newVNode);
  }
  
  // If one is array and the other is not, we replace
  if (Array.isArray(oldVNode) || Array.isArray(newVNode)) {
    return { type: "REPLACE", newVNode: Array.isArray(newVNode) ? newVNode[0] : newVNode };
  }

  // Replace if node types are different
  if (oldVNode.type !== newVNode.type) {
    return { type: "REPLACE", newVNode };
  }

  // Text node comparison
  if (oldVNode.type === "TEXT_ELEMENT" && oldVNode.props.nodeValue !== newVNode.props.nodeValue) {
    return { type: "TEXT", newVNode };
  }

  // Compare properties
  const propPatches = diffProps(oldVNode.props, newVNode.props);

  // Compare children
  const { childPatches, additionalPatches } = diffChildren(oldVNode.children, newVNode.children);

  // If there are no differences
  if (
    Object.keys(propPatches).length === 0 &&
    childPatches.every(patch => patch === null) &&
    additionalPatches.length === 0
  ) {
    return null;
  }

  // Return patch
  return {
    type: "PATCH",
    propPatches,
    childPatches,
    additionalPatches
  };
}

// Compare properties
function diffProps(oldProps: { [key: string]: any }, newProps: { [key: string]: any }) {
  const propPatches: { [key: string]: any } = {};

  // Add or update new properties
  for (const [key, value] of Object.entries(newProps)) {
    if (value !== oldProps[key]) {
      propPatches[key] = value;
    }
  }

  // Remove old properties that are not in newProps
  for (const key in oldProps) {
    if (!(key in newProps)) {
      propPatches[key] = null;
    }
  }

  return propPatches;
}

// Compare children
function diffChildren(oldChildren: (VNode | string | number)[], newChildren: (VNode | string | number)[]) {
  const childPatches: (Patch | null)[] = [];
  const additionalPatches: { type: "ADD"; newVNode: VNode }[] = [];

  oldChildren.forEach((oldChild, i) => {
    const newChild = newChildren[i];

    // Text or number comparison
    if (typeof oldChild === "string" || typeof oldChild === "number") {
      if (oldChild !== newChild) {
        childPatches.push({
          type: "TEXT",
          newVNode: { type: "TEXT_ELEMENT", props: { nodeValue: newChild?.toString() }, children: [] } as VNode
        });
      } else {
        childPatches.push(null);
      }
    } else {
      // Recursively diff child VNodes
      childPatches.push(diff(oldChild as VNode, newChild as VNode));
    }
  });

  // Handle additional new children
  for (let i = oldChildren.length; i < newChildren.length; i++) {
    additionalPatches.push({ type: "ADD", newVNode: newChildren[i] as VNode });
  }

  return { childPatches, additionalPatches };
}

function diffArrays(oldVNode: VNode, newVNode: VNode){

}

