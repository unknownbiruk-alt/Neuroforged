import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
declare global {
  interface Window {
    Paddle: any;
  }
}

window.addEventListener("load", () => {
  if (window.Paddle) {
    window.Paddle.Environment.set("sandbox"); // remove when going live

    window.Paddle.Initialize({
      token: live_e0c467bbcb40585005a274d7a89
    });
  }
});
    
 
 
