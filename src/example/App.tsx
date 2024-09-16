// src/App.tsx
import { createElement, render } from '../index';

// Define a basic state management approach
let count = 0;

function updateCount(newCount: number) {
  count = newCount;
  renderApp(); // Re-render the component to reflect the updated state
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
      <p>Count: {count}</p> {/* Display the count */}
    </div>
  );
};

// Render function to update the DOM
function renderApp() {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = ''; // Clear previous content
    render(createElement(App), app); // Render the updated component
  }
}

// Initial render
renderApp();
