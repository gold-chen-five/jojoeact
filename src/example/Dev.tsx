import { createElement } from "../index"
import { useTest } from "./store"
import { DevTwo } from "./DevTwo";
import { Test } from "./store";

export function Dev(){
    const { value, setValue } = useTest<Test>();
    return (
        <div>
            <button onclick={() => setValue("test")}>click</button>
            <div>{ value }</div>
            <DevTwo />
        </div>
    )
}