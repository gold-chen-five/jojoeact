import { createRoot } from "../index";
import { Router } from "./Route";
import { App } from "./App";

const root = createRoot(document.getElementById('jojo'));
root.renderApp(Router);
