import React from "react";
import ReactDOM from "react-dom";

import { Table } from "../index.mjs";

const App = () => (
  <>
    <h1>Example</h1>
    <Table />
  </>
);

ReactDOM.render(<App />, document.getElementById("root"));
