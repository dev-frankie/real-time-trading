import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OrderModalActions } from "../order-modal-actions";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "orderModal.buy": "매수",
        "orderModal.sell": "매도",
      };
      return map[key] ?? key;
    },
  }),
}));

describe("OrderModalActions", () => {
  it("renders buy/sell actions and triggers handlers", () => {
    const onBuy = vi.fn();
    const onSell = vi.fn();

    render(<OrderModalActions onBuy={onBuy} onSell={onSell} />);

    const buyButton = screen.getByRole("button", { name: "매수" });
    const sellButton = screen.getByRole("button", { name: "매도" });

    fireEvent.click(buyButton);
    fireEvent.click(sellButton);

    expect(onBuy).toHaveBeenCalledTimes(1);
    expect(onSell).toHaveBeenCalledTimes(1);
  });
});
