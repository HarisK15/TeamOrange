import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { UpdateClucksProvider } from "./contexts/UpdateClucksContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // adds routes to the application
  <React.StrictMode>
    <Router>
      <UpdateClucksProvider>
        <App />
      </UpdateClucksProvider>
    </Router>
  </React.StrictMode>
);
