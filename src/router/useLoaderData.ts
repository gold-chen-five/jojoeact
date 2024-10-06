import { create } from "../hooks/useStore";

export type LoaderData = {
    data: any,
    isFinish: boolean,
    setData: (data: any, isFinish: boolean) => void
}

export const useLoader = create<LoaderData>((set) => ({
    data: null,
    isFinish: false,
    setData: (data, isFinish) => set({data, isFinish})
}))

export const useLoaderData = <T>() => useLoader<T>(state => state.data)