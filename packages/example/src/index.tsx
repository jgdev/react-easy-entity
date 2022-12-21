import ReactDOM from "react-dom/client";
import { EntityProvider } from "react-easy-entity";
import debug from "debug";

import "./index.css";
import App from "./App";
import { createCustomStyleAdapter } from "./styleAdapter";

debug.enable("*");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <EntityProvider styleAdapter={createCustomStyleAdapter()}>
    <App />
  </EntityProvider>
);
