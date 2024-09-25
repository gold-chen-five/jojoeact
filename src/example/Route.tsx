import { Route, RouterProvider, createElement } from "../index"
import { App } from "./App"

const routes: Route[] = [
    {
        path: '/',
        component: App 
    }
]

export const Router = <RouterProvider routes={routes}/>
