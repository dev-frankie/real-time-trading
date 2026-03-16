import React from "react";
import ReactDOM from "react-dom/client";

import "@/shared/config/i18n";
import { QueryProvider } from "./providers/query-provider";
import { ThemeProvider } from "./providers/theme-provider";
import { AppRouter } from "./router";
import "./styles/global.css";

async function enableMocking(): Promise<void> {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("@/mocks/browser");
  await worker.start({
    onUnhandledRequest: "bypass",
  });
}

function renderApp(): void {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <ThemeProvider>
        <QueryProvider>
          <AppRouter />
        </QueryProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
}

void enableMocking().then(renderApp);
