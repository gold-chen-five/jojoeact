import { createElement } from "../index"

interface TestProps {
    count: number
}

export function Test({count}: TestProps){
    return (
        <div>{count}</div>
    )
}