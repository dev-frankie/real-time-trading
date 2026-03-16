import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageToggle } from "../language-toggle";

const changeLanguageMock = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "language.en": "EN",
        "language.kr": "KR",
      };
      return map[key] ?? key;
    },
    i18n: {
      resolvedLanguage: "kr",
      language: "kr",
      changeLanguage: changeLanguageMock,
    },
  }),
}));

describe("LanguageToggle", () => {
  beforeEach(() => {
    changeLanguageMock.mockClear();
  });

  it("renders language options and changes language on click", () => {
    render(<LanguageToggle />);

    const enButton = screen.getByRole("button", { name: "EN" });
    const krButton = screen.getByRole("button", { name: "KR" });

    expect(enButton).toBeInTheDocument();
    expect(krButton).toBeInTheDocument();

    fireEvent.click(enButton);
    fireEvent.click(krButton);

    expect(changeLanguageMock).toHaveBeenNthCalledWith(1, "en");
    expect(changeLanguageMock).toHaveBeenNthCalledWith(2, "kr");
  });
});
