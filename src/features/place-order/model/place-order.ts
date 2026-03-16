import type { OrderResult, OrderType } from "@/entities/orderbook";

interface PlaceOrderInput {
  type: OrderType;
  price: number;
  quantity: number;
}

export function createOrderResult(input: PlaceOrderInput): OrderResult {
  return {
    type: input.type,
    price: input.price,
    quantity: input.quantity,
    totalPrice: input.price * input.quantity,
  };
}
