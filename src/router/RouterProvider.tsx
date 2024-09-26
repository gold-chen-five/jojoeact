import { useEffect } from "../hooks/useEffect";
import { useState } from "../hooks/useState";
import { navigate } from "./navigate";
import { createElement } from "../core/vdom";

export type Route = {
    path: string;
    component: () => any;
    loader?: () => void | Promise<any | {redirect: string}>;
    children?: Route[];
};

export function RouterProvider({ routes } : { routes: Route[] }): () => any{
    const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        /**
         * @description 
         * 1.run loader 
         * 2.loader can return value 
         * 3.set the return value to data
         * 4.if return value have redirect, navigate to the redirect route
         */
        async function handleLocationChange(){
            setCurrentPath(window.location.pathname);
            const matchedRoute = matchRoute(window.location.pathname, routes);
            if(matchedRoute && matchedRoute.loader) {
                setLoading(true);
                const returnData = await matchedRoute.loader();
                
                if(returnData?.redirect) {
                    navigate(returnData.redirect);
                    return;
                }

                setData(returnData);
            }
            setLoading(false);
        }
        handleLocationChange();
        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    },[routes])

    const matchedRoute = matchRoute(currentPath, routes);

    if(!matchedRoute) throw new Error("there is no matched path");
    if(loading)  return <div></div>;

    const Component = matchedRoute.component;
    return <Component/>;
}

// recursive to find match route
function matchRoute(pathname: string, routes: Route[]): Route | undefined {
    for(const route of routes) {
        if(pathname === route.path) {
            return route;
        }

        if(route.children) {
            const matchedRoute = matchRoute(pathname, route.children);
            if(matchedRoute) return matchedRoute;
        }
    }

    return undefined;
}

