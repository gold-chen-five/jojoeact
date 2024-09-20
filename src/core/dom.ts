//src/core/dom.ts
import type { VNode } from "./vdom"
import { render } from "./render";
import { setCurrentRoot } from "../shared/dom-state";
import { diff } from "./diff";
import { patch } from "./patch";

export interface Root {
    renderApp: (vApp: VNode) => void;
    updateApp: (newVApp: VNode) => void    
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
        updateApp: (newVApp: VNode) => {
            const patches = diff(vApp, newVApp);
            rootNode = patch(rootNode, patches) as HTMLElement;
            vApp = newVApp;
        }
    };

    setCurrentRoot(root);
    return root;
}