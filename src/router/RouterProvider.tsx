import { useEffect } from "../hooks/useEffect";
import { useState } from "../hooks/useState";
import { navigate } from "./navigate";
import { createElement } from "../core/vdom";
import { useLoader, LoaderData } from "../router/useLoaderData";

type Redirect = { redirect: string}

export type Route = {
    path: string;
    component: () => any;
    loader?: <T>() => void | Promise<T | Redirect> | any | Redirect;
    children?: Route[];
};

let prevPath:string | undefined = undefined;

export function RouterProvider({ routes } : { routes: Route[] }): () => any{
    const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
    const { setData, isFinish } = useLoader<LoaderData>();

    useEffect(() => {
        /**
         * @description 
         * 1.run loader 
         * 2.loader can return value 
         * 3.set the return value to data
         * 4.if return value have redirect, navigate to the redirect route
         */
        async function handleLocationChange(){
            setCurrentPath(prevpath => {
                prevPath = prevpath
                return window.location.pathname;
            });
            const matchedRoute = matchRoute(window.location.pathname, routes);
            if(matchedRoute && matchedRoute.loader) {
                setData(null, false);
                const returnData = await matchedRoute.loader();
                if(returnData?.redirect) {
                    navigate(returnData.redirect);
                    return;
                }
                console.log(returnData)
                setData(returnData, true); 
            } else {
                setData(null, true);
            }
        }

        handleLocationChange();
        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    },[routes])

    const matchedRoute = matchRoute(currentPath, routes);
    if(!matchedRoute) throw new Error("there is no matched path");

    console.log(isFinish, prevPath, currentPath)
    if(!isFinish && prevPath && (prevPath !== currentPath)) {
        const prevMatchedRoute = matchRoute(prevPath, routes);
        if (!prevMatchedRoute) throw new Error("there is no prev matched path");
        const Component =  prevMatchedRoute.component;
        return <Component />
    }
    if(!isFinish) return <div></div>;

    const Component = matchedRoute.component;
    return <Component/>;
}

// recursive to find match route
function matchRoute(pathname: string, routes: Route[]): Route | undefined {
    if (!pathname) return undefined;
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

/**
 * @description use in loader, use the path to redirect
 * @param to path
 */
export function redirect(to: string):Redirect {
    return { redirect: to }
}
