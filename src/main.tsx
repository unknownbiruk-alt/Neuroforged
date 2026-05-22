import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
const openProCheckout = () => {
  window.Paddle.Checkout.open({
    items: [
      {
        priceId: "pri_PRO_ID",
        quantity: 1
      }
    ]
  });
};

const openEliteCheckout = () => {
  window.Paddle.Checkout.open({
    items: [
      {
        priceId: "pri_ELITE_ID",
        quantity: 1
      }
    ]
  });
};
