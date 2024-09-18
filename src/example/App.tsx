// src/App.tsx
import { createElement, render, diff, patch, VNode } from '../index';

// Define a basic state management approach
let count = 0;

function updateCount(newCount: number) {
  count = newCount;
  renderApp();
}

const App = () => {
  // Define a handler for the button click
  function handleClick() {
    updateCount(count + 1); // Increment count
  }

  return (
    <div className="my-component">
      <h1>Hello, World!</h1>
      <p>This is a paragraph.</p>
      <button onclick={handleClick}>Test</button>
      <p>Count: {count}</p>
    </div>
  );
};

let rootNode: Node;
let vApp: VNode;

// Render function to update the DOM
function renderApp() {
  const app = document.getElementById('jojo');
  if (app) {
    app.innerHTML = ''; // Clear previous content
    vApp = App();
    rootNode = render(vApp, app); // Render the updated component
  }
}

function updateApp(){
  const newVApp = App();
  console.log(newVApp)
  const patches = diff(vApp, newVApp);
  rootNode = patch(rootNode, patches) as HTMLElement;
  vApp = newVApp;
}

// Initial render
renderApp();
updateApp();
