import { Route, RouterProvider } from "../index"
import { App } from "./App"
import { Dev } from "./Dev";

const routes: Route[] = [
    {
        path: '/',
        component: App
    },
    {
        path: '/dev',
        component: Dev,
        loader: () => {
            console.log('dev')
        } 
    }
]

export const Router = () => RouterProvider({routes});
