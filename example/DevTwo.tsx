import { createElement } from "../src/index";
import { useTest, Test } from "./store"

export function DevTwo(){
    const { value } = useTest<Test>();
    return (
        <div>{value}</div>
    )
}