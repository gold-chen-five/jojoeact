import { create } from "../index";

type Test = {
    value: string;
    setValue: (value: string) => void
}

export const useTest = create<Test>((set) => ({
    value: 'default',
    setValue: (value) => set({value})
}));