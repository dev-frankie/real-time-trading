import { ORDERBOOK_DEFAULT_DEPTH } from "@/entities/orderbook";

export type OrderbookSource = "mock" | "binance";

const BINANCE_REST_BASE_URL = "https://api.binance.com";
const BINANCE_WS_BASE_URL = "wss://stream.binance.com:9443/ws";
const BINANCE_DEFAULT_SYMBOL = "BTCUSDT";
const BINANCE_DEFAULT_DEPTH_LIMIT = ORDERBOOK_DEFAULT_DEPTH;
const BINANCE_MAX_DEPTH_LIMIT = 20;

function parseDepthLimit(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return BINANCE_DEFAULT_DEPTH_LIMIT;
  }
  return Math.min(parsed, BINANCE_MAX_DEPTH_LIMIT);
}

const rawSource = (import.meta.env.VITE_ORDERBOOK_SOURCE ?? "mock").toLowerCase();

export const orderbookSource: OrderbookSource =
  rawSource === "binance" ? "binance" : "mock";

export const binanceOrderbookConfig = {
  restBaseUrl: import.meta.env.VITE_BINANCE_REST_BASE_URL ?? BINANCE_REST_BASE_URL,
  wsBaseUrl: import.meta.env.VITE_BINANCE_WS_BASE_URL ?? BINANCE_WS_BASE_URL,
  symbol: (import.meta.env.VITE_BINANCE_SYMBOL ?? BINANCE_DEFAULT_SYMBOL).toUpperCase(),
  depthLimit: parseDepthLimit(import.meta.env.VITE_BINANCE_DEPTH_LIMIT),
};
