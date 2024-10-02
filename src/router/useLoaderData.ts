import { create } from "../hooks/useStore";

export type LoaderData = {
    data: any,
    setData: (data: any) => void
}

export const useLoader = create<LoaderData>((set) => ({
    data: null,
    setData: (data) => set({data})
}))

export const useLoaderData = <T>() => useLoader<T>(state => state.data)