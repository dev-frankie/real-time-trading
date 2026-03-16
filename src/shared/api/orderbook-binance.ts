import type { OrderItem, OrderType } from "@/entities/orderbook";

import { binanceOrderbookConfig } from "@/shared/config/orderbook-source";

type BinanceDepthLevel = [string, string];

interface BinanceDepthSnapshotResponse {
  bids: BinanceDepthLevel[];
  asks: BinanceDepthLevel[];
}

interface BinanceDepthStreamPayload {
  b: BinanceDepthLevel[];
  a: BinanceDepthLevel[];
}

export interface BinanceDepthPatch {
  bids: BinanceDepthLevel[];
  asks: BinanceDepthLevel[];
}

function isDepthLevel(value: unknown): value is BinanceDepthLevel {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "string" &&
    typeof value[1] === "string"
  );
}

function isDepthSnapshotResponse(
  value: unknown,
): value is BinanceDepthSnapshotResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.bids) &&
    Array.isArray(candidate.asks) &&
    candidate.bids.every(isDepthLevel) &&
    candidate.asks.every(isDepthLevel)
  );
}

function isDepthStreamPayload(
  value: unknown,
): value is BinanceDepthStreamPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.b) &&
    Array.isArray(candidate.a) &&
    candidate.b.every(isDepthLevel) &&
    candidate.a.every(isDepthLevel)
  );
}

function toOrderItem(
  level: BinanceDepthLevel,
  type: OrderType,
): OrderItem | null {
  const price = Number(level[0]);
  const quantity = Number(level[1]);

  if (!Number.isFinite(price) || !Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  return {
    id: `${type}-${price.toFixed(2)}`,
    type,
    price,
    quantity,
  };
}

function mapDepthLevels(
  levels: BinanceDepthLevel[],
  type: OrderType,
): OrderItem[] {
  return levels
    .map((level) => toOrderItem(level, type))
    .filter((item): item is OrderItem => item !== null);
}

function sortByType(
  type: OrderType,
): (left: OrderItem, right: OrderItem) => number {
  if (type === "sell") {
    return (left, right) => left.price - right.price;
  }
  return (left, right) => right.price - left.price;
}

export function normalizeBinanceOrderbook(
  data: BinanceDepthSnapshotResponse,
): OrderItem[] {
  const asks = mapDepthLevels(data.asks, "sell")
    .sort(sortByType("sell"))
    .slice(0, binanceOrderbookConfig.depthLimit);
  const bids = mapDepthLevels(data.bids, "buy")
    .sort(sortByType("buy"))
    .slice(0, binanceOrderbookConfig.depthLimit);
  return [...asks, ...bids];
}

export async function fetchBinanceOrderbook(): Promise<OrderItem[]> {
  const url = new URL("/api/v3/depth", binanceOrderbookConfig.restBaseUrl);
  url.searchParams.set("symbol", binanceOrderbookConfig.symbol);
  url.searchParams.set("limit", String(binanceOrderbookConfig.depthLimit));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch Binance orderbook snapshot");
  }

  const data: unknown = await response.json();
  if (!isDepthSnapshotResponse(data)) {
    throw new Error("Invalid Binance orderbook snapshot response");
  }

  return normalizeBinanceOrderbook(data);
}

export function subscribeBinanceOrderbook(
  onPatch: (patch: BinanceDepthPatch) => void,
): () => void {
  const stream = `${binanceOrderbookConfig.symbol.toLowerCase()}@depth@1000ms`;
  const ws = new WebSocket(`${binanceOrderbookConfig.wsBaseUrl}/${stream}`);

  ws.addEventListener("message", (event) => {
    try {
      const payload: unknown = JSON.parse(event.data as string);
      if (!isDepthStreamPayload(payload)) {
        return;
      }
      onPatch({
        bids: payload.b,
        asks: payload.a,
      });
    } catch {
      // Ignore malformed packets.
    }
  });

  return () => {
    ws.close();
  };
}

export function applyBinanceDepthPatch(
  previousItems: OrderItem[],
  patch: BinanceDepthPatch,
): OrderItem[] {
  const sellMap = new Map<number, number>();
  const buyMap = new Map<number, number>();

  for (const item of previousItems) {
    if (item.type === "sell") {
      sellMap.set(item.price, item.quantity);
      continue;
    }
    buyMap.set(item.price, item.quantity);
  }

  for (const [priceRaw, quantityRaw] of patch.asks) {
    const price = Number(priceRaw);
    const quantity = Number(quantityRaw);

    if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
      continue;
    }

    if (quantity <= 0) {
      sellMap.delete(price);
      continue;
    }
    sellMap.set(price, quantity);
  }

  for (const [priceRaw, quantityRaw] of patch.bids) {
    const price = Number(priceRaw);
    const quantity = Number(quantityRaw);

    if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
      continue;
    }

    if (quantity <= 0) {
      buyMap.delete(price);
      continue;
    }
    buyMap.set(price, quantity);
  }

  const asks = Array.from(sellMap.entries())
    .map(([price, quantity]) => ({
      id: `sell-${price.toFixed(2)}`,
      type: "sell" as const,
      price,
      quantity,
    }))
    .sort((left, right) => left.price - right.price)
    .slice(0, binanceOrderbookConfig.depthLimit);

  const bids = Array.from(buyMap.entries())
    .map(([price, quantity]) => ({
      id: `buy-${price.toFixed(2)}`,
      type: "buy" as const,
      price,
      quantity,
    }))
    .sort((left, right) => right.price - left.price)
    .slice(0, binanceOrderbookConfig.depthLimit);

  return [...asks, ...bids];
}
