import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import "./styles/reset.css";
import "./styles/colors.css";
import "./styles/global.css";

void function Main() {
  let container = document.getElementById("root");
  if (!container) {
    throw new Error("container not found");
  }

  let root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}();
