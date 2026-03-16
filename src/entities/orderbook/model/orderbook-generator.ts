import type { OrderItem, OrderType } from "./types";
import {
  ORDERBOOK_MAX_QUANTITY,
  ORDERBOOK_MIN_QUANTITY,
  ORDERBOOK_PRICE_SWING_STEP,
  ORDERBOOK_PRICE_TICK,
} from "./constants";

interface GenerateOrderbookOptions {
  basePrice: number;
  depth: number;
  random?: () => number;
}

function randomQuantity(random: () => number): number {
  return (
    Math.floor(
      random() * (ORDERBOOK_MAX_QUANTITY - ORDERBOOK_MIN_QUANTITY + 1),
    ) + ORDERBOOK_MIN_QUANTITY
  );
}

function createItem(
  type: OrderType,
  price: number,
  random: () => number,
): OrderItem {
  return {
    id: `${type}-${price}`,
    price,
    quantity: randomQuantity(random),
    type,
  };
}

export function generateOrderbook({
  basePrice,
  depth,
  random = Math.random,
}: GenerateOrderbookOptions): OrderItem[] {
  const asks: OrderItem[] = [];
  const bids: OrderItem[] = [];

  for (let level = depth; level >= 1; level -= 1) {
    asks.push(
      createItem("sell", basePrice + ORDERBOOK_PRICE_TICK * level, random),
    );
  }

  for (let level = 0; level < depth; level += 1) {
    bids.push(
      createItem("buy", basePrice - ORDERBOOK_PRICE_TICK * level, random),
    );
  }

  return [...asks, ...bids];
}

export function nextBasePrice(
  currentPrice: number,
  random: () => number = Math.random,
): number {
  const swing =
    (Math.floor(random() * (ORDERBOOK_PRICE_SWING_STEP * 2 + 1)) -
      ORDERBOOK_PRICE_SWING_STEP) *
    ORDERBOOK_PRICE_TICK;
  return Math.max(ORDERBOOK_PRICE_TICK, currentPrice + swing);
}
