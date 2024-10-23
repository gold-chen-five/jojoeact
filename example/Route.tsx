import { Route, RouterProvider, redirect } from "../src/index";
import { App } from "./App";
import { Dev } from "./Dev";

const routes: Route[] = [
    {
        path: "/",
        component: App
    },
    {
        path: "/dev",
        component: Dev,
        loader: () => {
            console.log('loader')
            return {user: '111'};
        } 
    }
]

export const Router = () => RouterProvider({routes});
