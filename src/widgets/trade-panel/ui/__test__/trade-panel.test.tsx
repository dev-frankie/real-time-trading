import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TradePanel } from "../trade-panel";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "trade.title": "실시간 호가 및 주문 시스템",
        "trade.subtitle": "호가를 선택해 주문을 진행하세요.",
        "trade.fetchError": "호가 데이터를 불러오지 못했습니다.",
        "trade.retry": "재시도",
        "trade.retrying": "재시도 중...",
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock("@/shared/ui/language-toggle", () => ({
  LanguageToggle: () => <div data-testid="language-toggle" />,
}));

vi.mock("@/shared/ui/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock("@/widgets/order-book/ui/order-book-skeleton", () => ({
  OrderBookSkeleton: () => <div data-testid="orderbook-skeleton" />,
}));

describe("TradePanel", () => {
  it("renders loading state skeleton", () => {
    render(
      <TradePanel
        items={[]}
        isLoading={true}
        isError={false}
        isFetching={false}
        onRetry={vi.fn()}
        onSelectOrder={vi.fn()}
      />,
    );

    expect(screen.getByTestId("orderbook-skeleton")).toBeInTheDocument();
  });

  it("renders error state and calls retry handler", () => {
    const onRetry = vi.fn();

    render(
      <TradePanel
        items={[]}
        isLoading={false}
        isError={true}
        isFetching={false}
        onRetry={onRetry}
        onSelectOrder={vi.fn()}
      />,
    );

    expect(screen.getByText("호가 데이터를 불러오지 못했습니다.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "재시도" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
