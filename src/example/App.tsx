// src/App.tsx
import { createElement, createRoot, useState, useEffect } from '../index';
import { Test } from './Test';

const App = () => {
  const [count, setCount] = useState<number>(0);
  const [object, setObject] = useState<{test: string}>({test: 'hello'});

  // Define a handler for the button click
  function handleClick() {
    setCount((prev) => prev+1);
  }

  function handleOnChange(e: Event){
    const target = e.target as HTMLInputElement;  
    const value = target.value;
    setObject({test: value})
  }

  useEffect(() => {
    return () => {
      console.log("cleanup");
    }
  },[count]);

  function createArr(length: number): number[]{
    let arr = [];
    for(let i=0; i<length ; i++) {
      arr.push(i);
    }
    return arr;
  }

  const arr = createArr(count);

  return (
    <div className="my-component">
      <h1>main</h1>
      <button onclick={handleClick}>Test</button>
      <input oninput={handleOnChange}/>
      <p>{object.test}</p>
      <Test count={count}/>

      {
        arr.map((v) => (
          <div>{v}</div>
        ))
      }
      
    </div>
  );
};

const root = createRoot(document.getElementById('jojo'));
root.renderApp(App);

