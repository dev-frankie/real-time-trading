import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "../theme-toggle";

const setThemeMock = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "theme.light": "라이트",
        "theme.dark": "다크",
        "theme.system": "시스템",
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock("@/shared/model/stores/theme-store", () => ({
  useThemeStore: (
    selector: (state: { theme: "light"; setTheme: typeof setThemeMock }) => unknown,
  ) =>
    selector({
      theme: "light",
      setTheme: setThemeMock,
    }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    setThemeMock.mockClear();
  });

  it("renders theme options and updates selected theme", () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole("button", { name: "다크" }));
    fireEvent.click(screen.getByRole("button", { name: "시스템" }));

    expect(setThemeMock).toHaveBeenNthCalledWith(1, "dark");
    expect(setThemeMock).toHaveBeenNthCalledWith(2, "system");
  });
});
