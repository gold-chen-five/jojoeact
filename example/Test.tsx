// example/Test.tsx
import { createElement } from "../src/index"

interface TestProps {
    count: number
}

export function Test({count}: TestProps){

    return (
        <div>
            <p>count: {count}</p>
        </div>
    )
}   