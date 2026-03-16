import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  ORDERBOOK_LIST_STALE_TIME_MS,
  ORDERBOOK_TIMELINE_MAX_POINTS,
  ORDERBOOK_UPDATE_INTERVAL_MS,
  type OrderItem,
} from "@/entities/orderbook";
import {
  applyBinanceDepthPatch,
  fetchBinanceOrderbook,
  subscribeBinanceOrderbook,
} from "@/shared/api/orderbook-binance";
import { fetchMockOrderbook } from "@/shared/api/orderbook";
import { orderbookSource } from "@/shared/config/orderbook-source";

const orderbookQueryKeys = {
  all: ["orderbook"] as const,
  list: () => [...orderbookQueryKeys.all, "list"] as const,
};

interface UseOrderbookStreamResult {
  items: OrderItem[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => Promise<unknown>;
}

function withTimeline(previousItems: OrderItem[], nextItems: OrderItem[]): OrderItem[] {
  const previousMap = new Map(previousItems.map((item) => [item.id, item.timeline ?? []]));

  return nextItems.map((item) => {
    const previousTimeline = previousMap.get(item.id) ?? [];
    const nextTimeline = [...previousTimeline, item.quantity].slice(-ORDERBOOK_TIMELINE_MAX_POINTS);

    return {
      ...item,
      timeline:
        nextTimeline.length > 0 ? nextTimeline : [item.quantity, item.quantity, item.quantity],
    };
  });
}

export function useOrderbookStream(): UseOrderbookStreamResult {
  const [items, setItems] = useState<OrderItem[]>([]);
  const isBinanceSource = orderbookSource === "binance";

  const query = useQuery({
    queryKey: orderbookQueryKeys.list(),
    queryFn: () => (isBinanceSource ? fetchBinanceOrderbook() : fetchMockOrderbook()),
    staleTime: ORDERBOOK_LIST_STALE_TIME_MS,
    refetchInterval: isBinanceSource ? ORDERBOOK_LIST_STALE_TIME_MS : ORDERBOOK_UPDATE_INTERVAL_MS,
  });

  useEffect(() => {
    if (!query.data) {
      return;
    }

    setItems((currentItems) => withTimeline(currentItems, query.data));
  }, [query.data]);

  useEffect(() => {
    if (!isBinanceSource) {
      return;
    }

    const unsubscribe = subscribeBinanceOrderbook((patch) => {
      setItems((currentItems) => {
        const patchedItems = applyBinanceDepthPatch(currentItems, patch);
        return withTimeline(currentItems, patchedItems);
      });
    });

    return () => {
      unsubscribe();
    };
  }, [isBinanceSource]);

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: () => query.refetch(),
  };
}
