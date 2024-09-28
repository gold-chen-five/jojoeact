import { createElement, useState } from "../index"

export function Dev(){
    const [test,setTest] = useState(0)
    return (
        <div>
            <button onClick={() => setTest(prev => prev + 1)}>test</button>
            <p>{test}</p>
        </div>
    )
}