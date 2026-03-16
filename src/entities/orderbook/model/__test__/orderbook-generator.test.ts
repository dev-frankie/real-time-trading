import { describe, expect, it } from "vitest";

import { ORDERBOOK_PRICE_TICK } from "../constants";
import { generateOrderbook, nextBasePrice } from "../orderbook-generator";

describe("orderbook-generator", () => {
  it("generates deterministic quantities when random is injected", () => {
    const random = () => 0;

    const orderbook = generateOrderbook({
      basePrice: 100000,
      depth: 2,
      random,
    });

    expect(orderbook).toHaveLength(4);
    expect(orderbook.every((item) => item.quantity === 1)).toBe(true);
  });

  it("calculates deterministic next base price when random is injected", () => {
    const random = () => 0.9999;

    const next = nextBasePrice(100000, random);

    expect(next).toBe(100000 + ORDERBOOK_PRICE_TICK * 2);
  });
});
