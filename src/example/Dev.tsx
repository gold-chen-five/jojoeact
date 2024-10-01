import { createElement } from "../index"
import { useTest } from "./store"
import { DevTwo } from "./DevTwo";

export function Dev(){
    const { value, setValue } = useTest();

    return (
        <div>
            <button onclick={() => setValue("test")}>click</button>
            <div>{ value }</div>
            <DevTwo />
        </div>
    )
}