import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MoodProvider } from "./context/MoodContext.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <MoodProvider>
    <App />
  </MoodProvider>
);
