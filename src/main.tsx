import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

declare global {
  interface Window {
    Paddle: any;
  }
}

// Paddle.js is loaded synchronously in <head> so it's available immediately
if (window.Paddle) {
  window.Paddle.Initialize({
    token: "live_e0c467bbcb40585005a274d7a89",
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

