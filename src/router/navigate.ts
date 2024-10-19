import { useLoader, LoaderData } from "./useLoaderData";

/**
 * @description use (window history pushState) to navigate 
 * @param to - path
 */
export function navigate(to: string) {
    window.history.pushState({}, '', to);
    const popStateEvent = new PopStateEvent('popstate');
    window.dispatchEvent(popStateEvent);
}

export function useNavigate() {
    const { setData } = useLoader<LoaderData>();

    return (to: string) => {
        setData(null, false);
        navigate(to);
    }
}