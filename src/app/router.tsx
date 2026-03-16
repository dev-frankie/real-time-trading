import type { ReactElement } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { CompletePage } from "@/pages/complete";
import { TradePage } from "@/pages/trade";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/trade" replace /> },
  { path: "/trade", element: <TradePage /> },
  { path: "/complete", element: <CompletePage /> },
]);

export function AppRouter(): ReactElement {
  return <RouterProvider router={router} />;
}
