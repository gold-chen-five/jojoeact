// src/App.tsx
import { createElement, createRoot, useState } from '../index';
import { Test } from './Test';

const App = () => {
  const [count, setCount] = useState<number>(0);

  // Define a handler for the button click
  function handleClick() {
    setCount((prev) => prev+1);
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
