import { isOrderItem, ORDERBOOK_ENDPOINT, type OrderItem } from "@/entities/orderbook";
import { apiClient } from "@/shared/api/client";

interface OrderbookResponse {
  items: OrderItem[];
}

function isOrderbookResponse(value: unknown): value is OrderbookResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (!Array.isArray(candidate.items)) {
    return false;
  }

  return candidate.items.every((item) => isOrderItem(item));
}

export async function fetchMockOrderbook(): Promise<OrderItem[]> {
  const { data } = await apiClient.GET(ORDERBOOK_ENDPOINT);

  if (!data) {
    throw new Error("Failed to fetch orderbook");
  }
  const payload: unknown = data;

  if (!isOrderbookResponse(payload)) {
    throw new Error("Invalid orderbook response");
  }

  return payload.items;
}
