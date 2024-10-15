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
    const [value, setValue] = useState<string>('default')
    console.log(value)
    return (
        <div>
            <h1>{data.user}</h1>
            <button onclick={() => setValue('test')}>test</button>
            <div>{value}</div>
            {/* <button onclick={() => setValue("test")}>click</button>
            <div>{ value }</div>
            <DevTwo /> */}
        </div>
    )
}