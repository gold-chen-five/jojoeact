//src/core/dom.ts
import type { VNode } from "./vdom"
import { render } from "./render";
import { diff } from "./diff";
import { patch } from "./patch";
import { setCurrentRoot } from "../shared/dom-state";
import { createElement } from "./vdom";

export interface Root {
    renderApp: (vApp: any) => void;
    updateApp: () => void    
}

export function createRoot(rootElement: HTMLElement | null): Root {
    if (!rootElement) {
        throw new Error('Invalid root element');
    }
    let rootNode: Node;
    let vApp: VNode;
    let recreateVApp: () => VNode;

    const root: Root =  { 
        renderApp: (App) => {
            if (typeof App !== 'function') {
                throw new Error("renderApp param's type must be a function")
            }
            recreateVApp = App;  
            vApp = recreateVApp();
            rootNode = render(vApp, rootElement);
            root.updateApp();
        },
        updateApp: () => {
            const newVApp = recreateVApp();
            const patches = diff(vApp, newVApp);
            rootNode = patch(rootNode, patches) as HTMLElement;
            vApp = newVApp;
        }
    };
    
    setCurrentRoot(root);
    return root;
}