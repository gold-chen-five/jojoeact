import { createElement, useLoaderData, useState } from "../src/index"
import { useTest } from "./store"
import { DevTwo } from "./DevTwo";
import { Test } from "./store";

type Data = {
    user: string;
}

export function Dev(){
    const data = useLoaderData<Data>();
    // const { value, setValue } = useTest<Test>();
    const [value, setValue] = useState<boolean>(false)
    return (
        <div>
            {/* <h1>{data.user}</h1> */}
            <h1>{value ? false : "test"}</h1>
            <button onclick={() => setValue(prev => !prev)}>test</button>
            <div>{value ? "default" : "test"}</div>
            {/* <button onclick={() => setValue("test")}>click</button>
            <div>{ value }</div>
            <DevTwo /> */}
        </div>
    )
}