import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import { getRouter } from "./router";

const router = getRouter();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
