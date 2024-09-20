// src/App.tsx
import { createElement, createRoot, currentRoot, useState } from '../index';
import { Test } from './Test';
  // Define a basic state management approach
const App = () => {
  const [count, setCount] = useState<number>(0);


  // function updateCount(newCount: number) {
  //   count = newCount;
  //   console.log(<App />);
  //   currentRoot?.updateApp(<App />);
  // }


  // Define a handler for the button click
  function handleClick() {
    // Increment count
    setCount(count + 1);
  }

  return (
    <div className="my-component">
      <h1>main</h1>
      <button onClick={handleClick}>Test</button>
      <Test count={count}/>
    </div>
  );
};

const root = createRoot(document.getElementById('jojo'));
root.renderApp(<App />);
//root.updateApp();
