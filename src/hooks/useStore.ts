/**
 * useStore is similar to zustand useStore
 * under the hood: use listener、subscribe、set to control state store
 */

import { useEffect } from "./useEffect";
import { useState } from "./useState";

type SetStateInternal<T> = {
    (partial: T | Partial<T> | ((state: T) => T | Partial<T>)): void;
};

type StateCreator<T> = (set: SetStateInternal<T>, get: () => T) => T;

/**
 * @description create a store with:
 * state
 * listeners 
 * setState
 * getState
 * subscribe 
 * useStore
 * @param createState function, (set) => 
 * @returns return useStore hook
 */
export function create<T extends object>(createState: StateCreator<T>):(<U>(selector?: (state: T) => U) => U) {
    let state: T;
    const listeners = new Set<(state: T) => void>();

    // check every state
    const checkIsSame = (oldState: T, newState: T): boolean => {
        let isSame = true;
        for (const property in newState) {
            if(oldState[property] !== newState[property]) {
                isSame = false;
                break;
            } 
        }
        return isSame;
    }

    const setState:SetStateInternal<T> = (partial) => {
        const nextState = typeof partial === 'function' ? (partial as (state:T) => T)(state) : partial;
        const nextStateAndAction = { ...state, ...nextState };

        if(!checkIsSame(state, nextStateAndAction)) {
            state = nextStateAndAction; // state will have actions
            listeners.forEach(listener => listener(state));
        }
    }

    const getState = () => state;

    const subscribe = (listener: (state: T) => void) => {
        listeners.add(listener);

        // unsubscribe 
        return () => listeners.delete(listener);
    }

    const useStore = <U>(selector: (state: T) => U = (state: T) => state as unknown as U ): U => {
        const [ selectedState, setSelectedState ] = useState(selector(state));

        useEffect(() => {
            const unsubscribe = subscribe((state) => {
                const nextState = selector(state);
                if (!Object.is(nextState, selectedState)) {
                    setSelectedState(nextState);
                }
            });

            return unsubscribe;
        },[selector]);
        return selectedState;
    }

    state = createState(setState, getState);

    return useStore;
}