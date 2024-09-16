# Virtual DOM 實現詳細解釋

## 型別定義

```typescript
type VNodeType = string | Function;

interface VNode {
  type: VNodeType;
  props: { [key: string]: any };
  children: (VNode | string)[];
}
```

- `VNodeType`: 定義了虛擬節點的類型，可以是字符串（對應 HTML 標籤）或函數（用於自定義組件）。
- `VNode`: 定義了虛擬節點的結構，包含類型、屬性和子節點。

## createElement 函數

```typescript
function createElement(type: VNodeType, props: { [key: string]: any } | null, ...children: (VNode | string)[]): VNode {
  return { type, props: props || {}, children };
}
```

這個函數用於創建虛擬 DOM 節點。它接受節點類型、屬性和子節點作為參數，返回一個 `VNode` 對象。

## createTextElement 函數

```typescript
function createTextElement(text: string): VNode {
  return {
    type: "TEXT_ELEMENT",
    props: { nodeValue: text },
    children: []
  };
}
```

這個函數用於創建文本節點的虛擬 DOM 表示。

## render 函數

```typescript
function render(vnode: VNode | string, container: HTMLElement): Node {
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
```

`render` 函數將虛擬 DOM 轉換為實際的 DOM 節點：
1. 如果 `vnode` 是字符串，直接創建文本節點。
2. 否則，創建對應的 DOM 元素。
3. 設置元素的屬性。
4. 遞迴處理子節點。
5. 將創建的節點添加到容器中。
6. 返回創建的節點。

## Patch 類型定義

```typescript
type Patch = 
  | { type: "REPLACE"; newVNode: VNode }
  | { type: "TEXT"; newVNode: VNode }
  | { 
      type: "PATCH"; 
      propPatches: { [key: string]: any }; 
      childPatches: (Patch | null)[];
      additionalPatches: { type: "ADD"; newVNode: VNode }[];
    };
```

這個類型定義了可能的 DOM 更新操作：替換節點、更新文本、修改屬性或子節點。

## diff 函數

```typescript
function diff(oldVNode: VNode, newVNode: VNode): Patch | null {
  // 如果節點類型不同，直接替換
  if (oldVNode.type !== newVNode.type) {
    return { type: "REPLACE", newVNode };
  }

  // 如果是文本節點且內容不同，更新文本
  if (
    oldVNode.type === "TEXT_ELEMENT" &&
    oldVNode.props.nodeValue !== newVNode.props.nodeValue
  ) {
    return { type: "TEXT", newVNode };
  }

  // 比較屬性
  const propPatches: { [key: string]: any } = {};
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
    if (typeof oldChild !== "string" && typeof newVNode.children[i] !== "string") {
      childPatches.push(diff(oldChild, newVNode.children[i] as VNode));
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
```

`diff` 函數比較兩個虛擬 DOM 樹，生成需要應用的更改：
1. 檢查節點類型是否改變。
2. 對於文本節點，檢查內容是否改變。
3. 比較屬性的變化。
4. 遞迴比較子節點。
5. 記錄新增的子節點。
6. 如果沒有變化，返回 null；否則返回包含所有更改的 patch 對象。

## patch 函數

```typescript
function patch(dom: Node, patchObj: Patch | null): Node {
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
    // 更新屬性
    for (const [key, value] of Object.entries(patchObj.propPatches)) {
      if (value === null) {
        (dom as Element).removeAttribute(key);
      } else {
        (dom as Element).setAttribute(key, value);
      }
    }

    // 更新子節點
    patchObj.childPatches.forEach((childPatch, i) => {
      patch(dom.childNodes[i], childPatch);
    });

    // 添加新子節點
    patchObj.additionalPatches.forEach(additionalPatch => {
      const newChildDOM = render(additionalPatch.newVNode, document.createElement("div"));
      dom.appendChild(newChildDOM);
    });
  }

  return dom;
}
```

`patch` 函數將 `diff` 函數生成的更改應用到實際的 DOM：
1. 如果 patch 對象為 null，不做任何更改。
2. 對於 "REPLACE" 類型，用新節點替換舊節點。
3. 對於 "TEXT" 類型，更新文本內容。
4. 對於 "PATCH" 類型：
   - 更新屬性
   - 遞迴更新子節點
   - 添加新的子節點

這個實現提供了一個基本的 Virtual DOM 系統，可以高效地更新 DOM，避免不必要的 DOM 操作。
