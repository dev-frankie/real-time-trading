import type { OrderItem, OrderType } from "./types";

function isOrderType(value: unknown): value is OrderType {
  return value === "buy" || value === "sell";
}

export function isOrderItem(value: unknown): value is OrderItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const hasValidTimeline =
    candidate.timeline === undefined ||
    (Array.isArray(candidate.timeline) &&
      candidate.timeline.every(
        (point) => typeof point === "number" && Number.isFinite(point),
      ));

  return (
    typeof candidate.id === "string" &&
    typeof candidate.price === "number" &&
    Number.isFinite(candidate.price) &&
    typeof candidate.quantity === "number" &&
    Number.isFinite(candidate.quantity) &&
    isOrderType(candidate.type) &&
    hasValidTimeline
  );
}
