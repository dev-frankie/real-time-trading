import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = ["en", "kr"] as const;

export function LanguageToggle(): ReactElement {
  const { t, i18n } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language ?? "en").startsWith(
    "kr",
  )
    ? "kr"
    : "en";

  return (
    <div className="inline-flex items-center gap-1 rounded-sm border border-(--color-border-default) bg-(--color-bg-surface) p-1">
      {LANGUAGES.map((language) => (
        <button
          key={language}
          type="button"
          className={`cursor-pointer rounded-sm px-2 py-1 text-xs transition-colors ${
            currentLanguage === language
              ? "bg-(--color-cta) text-(--color-on-accent)"
              : "text-(--color-text-secondary) hover:bg-(--color-bg-page)"
          }`}
          onClick={() => {
            void i18n.changeLanguage(language);
          }}
        >
          {t(`language.${language}`)}
        </button>
      ))}
    </div>
  );
}
