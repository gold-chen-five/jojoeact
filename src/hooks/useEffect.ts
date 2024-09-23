
type Dependency = any[];
type EffectCallback = () => (void | (() => void));

let effects: (void | (() => void))[] = [];
let dependencies: Dependency[] = [];
let currentIndex: number = 0;

/**
 * @description this is a hooks that simulate to the react useEffect
 * @param effect - run the effect when deps change
 * @param deps - useEffect will listen to the deps, when deps value change it run the effect function
 */
export function useEffect(effect: EffectCallback, deps: any[]){
    const hasChanged = dependencies[currentIndex] 
        ? !deps.every((dep,i) => dep === dependencies[currentIndex][i]) 
        : true;
    
    if (hasChanged) {
        // cleanup
        if (effects[currentIndex - 1]) {
            const cleanup = effects[currentIndex - 1];
            if (typeof cleanup === 'function') {
                cleanup();  // 
            }
        }
    
        dependencies[currentIndex] = deps;
        effects[currentIndex] = effect();  
    }
    
    currentIndex++; 
}