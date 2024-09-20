//src/core/dom.ts
import type {VNode } from "./vdom"
import { render } from "./render";
import { diff } from "./diff";
import { patch } from "./patch";

export interface Root {
    renderApp: (vApp: VNode) => void;
    updateApp: () => void    
}

export function createRoot(rootElement: HTMLElement | null): Root{
    if (!rootElement) {
        throw new Error('Invalid root element');
    }
    let rootNode: Node;
    let vApp: VNode;

    const root: Root =  { 
        renderApp: (App) => {
            vApp = App;
            rootNode = render(App, rootElement);
        },
        updateApp: () => {
            const newVApp = vApp;
            console.log(newVApp);
            const patches = diff(vApp, newVApp);
            rootNode = patch(rootNode, patches) as HTMLElement;
            vApp = newVApp;
        }
    };
    
    return root;
}