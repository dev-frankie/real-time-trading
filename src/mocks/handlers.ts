import { http, HttpResponse } from "msw";

import {
  generateOrderbook,
  nextBasePrice,
  ORDERBOOK_DEFAULT_BASE_PRICE,
  ORDERBOOK_DEFAULT_DEPTH,
  ORDERBOOK_ENDPOINT,
} from "@/entities/orderbook";
import type { operations } from "@/shared/api/openapi/schema";

type GetOrderbookResponse =
  operations["getOrderbook"]["responses"][200]["content"]["application/json"];

let basePrice = ORDERBOOK_DEFAULT_BASE_PRICE;

export const handlers = [
  http.get(ORDERBOOK_ENDPOINT, () => {
    basePrice = nextBasePrice(basePrice);
    const payload: GetOrderbookResponse = {
      items: generateOrderbook({
        basePrice,
        depth: ORDERBOOK_DEFAULT_DEPTH,
      }),
    };

    return HttpResponse.json<GetOrderbookResponse>(payload);
  }),
];
