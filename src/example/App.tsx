// src/App.tsx
import { createElement, createRoot, currentRoot } from '../index';
import { Test } from './Test';

// Define a basic state management approach
let count = 0;

function updateCount(newCount: number) {
  count = newCount;
  currentRoot?.updateApp(<App />);
}

const App = () => {
  // Define a handler for the button click
  function handleClick() {
    updateCount(count + 1); // Increment count
  }

  return (
    <div className="my-component">
      <h1>main</h1>
      <button onclick={handleClick}>Test</button>
      <Test count={count}/>
    </div>
  );
};

const root = createRoot(document.getElementById('jojo'));
root.renderApp(<App />);
root.updateApp(<App />);
