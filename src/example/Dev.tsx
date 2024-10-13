import { createElement, useLoaderData } from "../index"
import { useTest } from "./store"
import { DevTwo } from "./DevTwo";
import { Test } from "./store";

type Data = {
    user: string;
}

export function Dev(){
    const { value, setValue } = useTest<Test>();
    const data = useLoaderData<Data>();
    return (
        <div>
            <h1>{data.user}</h1>
            <button onclick={() => setValue("test")}>click</button>
            <div>{ value }</div>
            <DevTwo />
        </div>
    )
}