import type { PropsWithChildren, ReactElement } from "react";
import { useEffect } from "react";

import { applyThemeToDOM, useThemeStore } from "@/shared/model/stores/theme-store";

export function ThemeProvider({ children }: PropsWithChildren): ReactElement {
  const theme = useThemeStore((state) => state.theme);
  const getResolvedTheme = useThemeStore((state) => state.getResolvedTheme);
  const setResolvedTheme = useThemeStore((state) => state.setResolvedTheme);

  useEffect(() => {
    const resolvedTheme = getResolvedTheme();
    setResolvedTheme(resolvedTheme);
  }, [getResolvedTheme, setResolvedTheme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (): void => {
      if (useThemeStore.getState().theme !== "system") {
        return;
      }

      const resolvedTheme = useThemeStore.getState().getResolvedTheme();
      useThemeStore.getState().setResolvedTheme(resolvedTheme);
    };

    const handleStorageChange = (event: StorageEvent): void => {
      if (event.key !== "theme-storage") {
        return;
      }

      void useThemeStore.persist.rehydrate();
      const resolvedTheme = useThemeStore.getState().getResolvedTheme();
      applyThemeToDOM(resolvedTheme);
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [theme]);

  return <>{children}</>;
}
