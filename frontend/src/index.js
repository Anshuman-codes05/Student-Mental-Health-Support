import React from "react";
import ReactDOM from "react-dom/client";
import AppWithAuth from "./App"; // Import AppWithAuth as the default export

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>
);
