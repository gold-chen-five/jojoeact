import { createElement } from "../index";
import { useTest } from "./store"

export function DevTwo(){
    const { value } = useTest();
    return (
        <div>{value}</div>
    )
}