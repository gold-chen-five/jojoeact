// examples/main.ts
import { createElement, render, diff, patch, VNode } from '../index';

function createApp() {
  const createVApp = (count: number): VNode => createElement("div", null,
    createElement("h1", null, "Counter"),
    createElement("p", null, `Count: ${count}`),
    createElement("button", { onclick: () => updateApp(count + 1) }, "Increment")
  );

  let vApp = createVApp(0);
  const container = document.getElementById("jojo");

  if (!container) {
    throw new Error("Container element not found");
  }

  let rootNode = render(vApp, container);

  function updateApp(count: number) {
    const newVApp = createVApp(count);
    const patches = diff(vApp, newVApp);
    rootNode = patch(rootNode, patches) as HTMLElement;
    vApp = newVApp;
  }

  // 初始渲染
  updateApp(0);
}

// 當 DOM 完全加載後運行應用
document.addEventListener('DOMContentLoaded', createApp);