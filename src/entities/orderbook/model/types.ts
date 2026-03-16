export type OrderType = "sell" | "buy";

export interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  type: OrderType;
  timeline?: number[];
}

export interface OrderResult {
  type: OrderType;
  price: number;
  quantity: number;
  totalPrice: number;
}
