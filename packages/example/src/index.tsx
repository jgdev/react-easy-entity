import React from "react";
import ReactDOM from "react-dom/client";
import { EntityProvider } from "react-easy-entity";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import debug from "debug";

debug.enable("*");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <EntityProvider>
    <App />
  </EntityProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
