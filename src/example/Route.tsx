import { Route, RouterProvider, redirect } from "../index";
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
        // loader: () => {
        //     console.log("dev");
        //     return redirect("/");
        // } 
    }
]

export const Router = () => RouterProvider({routes});
