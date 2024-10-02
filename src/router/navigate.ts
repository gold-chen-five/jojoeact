/**
 * @description use (window history pushState) to navigate 
 * @param to - path
 */
export function navigate(to: string) {
    window.history.pushState({}, '', to);
    const popStateEvent = new PopStateEvent('popstate');
    window.dispatchEvent(popStateEvent);
}
