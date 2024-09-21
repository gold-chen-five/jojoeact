// src/App.tsx
import { createElement, createRoot, currentRoot, useState } from '../index';
import { Test } from './Test';

let count = 0;

// Define a basic state management approach
const App = () => {
  //const [count, setCount] = useState<number>(0);


  function updateCount(newCount: number) {
    count = newCount;
    currentRoot?.updateApp();
  }


  // Define a handler for the button click
  function handleClick() {
    updateCount(count + 1);
    console.log('test');
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
root.renderApp(App);
