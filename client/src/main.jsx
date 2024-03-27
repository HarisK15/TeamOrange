import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  // adds routes to the application
  <React.StrictMode>
    <Router>
        <App />
    </Router>
  </React.StrictMode>
);
