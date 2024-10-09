import { createRoot } from "../src/index";
import { Router } from "./Route";

const root = createRoot(document.getElementById('jojo'));
root.renderApp(Router);
