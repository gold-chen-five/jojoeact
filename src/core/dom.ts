import type { VNode } from "./vdom"
import { render } from "./render";

interface Root {
    renderApp: (vApp: VNode) => void
}

export function createRoot(rootElement: HTMLElement | null): Root{
    if (!rootElement) {
        throw new Error('Invalid root element');
    }
    
    return { 
        renderApp: (vApp) => {
            render(vApp, rootElement);
        }
    }
}