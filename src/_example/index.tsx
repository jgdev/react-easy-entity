import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import debug from "debug";

localStorage.setItem("debug", window.process.env.DEBUG || "");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
