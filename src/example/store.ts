import { create } from "../index";

export type Test = {
    value: string;
    setValue: (value: string) => void
}

export const useTest = create<Test>((set) => ({
    value: 'default',
    setValue: (value) => set({value})
}));