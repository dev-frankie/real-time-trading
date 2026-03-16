import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";

import type { Theme } from "@/shared/model/stores/theme-store";
import { useThemeStore } from "@/shared/model/stores/theme-store";

const THEMES: Theme[] = ["light", "dark", "system"];

export function ThemeToggle(): ReactElement {
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <div className="inline-flex items-center gap-1 rounded-sm border border-(--color-border-default) bg-(--color-bg-surface) p-1">
      {THEMES.map((item) => (
        <button
          key={item}
          type="button"
          className={`cursor-pointer rounded-sm px-2 py-1 text-xs transition-colors ${
            theme === item
              ? "bg-(--color-cta) text-(--color-on-accent)"
              : "text-(--color-text-secondary) hover:bg-(--color-bg-page)"
          }`}
          onClick={() => {
            setTheme(item);
          }}
        >
          {t(`theme.${item}`)}
        </button>
      ))}
    </div>
  );
}
