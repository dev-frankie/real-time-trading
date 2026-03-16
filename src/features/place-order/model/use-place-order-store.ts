import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { OrderResult } from "@/entities/orderbook";

interface SelectedQuote {
  price: number;
  quantity: number;
}

interface PlaceOrderState {
  selectedQuote: SelectedQuote | null;
  orderResultsById: Record<string, OrderResult>;
  setSelectedQuote: (quote: SelectedQuote) => void;
  clearSelectedQuote: () => void;
  setOrderResult: (orderId: string, result: OrderResult) => void;
  clearOrderResult: (orderId: string) => void;
}

const PLACE_ORDER_STORAGE_KEY = "place-order-store";

export const usePlaceOrderStore = create<PlaceOrderState>()(
  persist(
    (set) => ({
      selectedQuote: null,
      orderResultsById: {},
      setSelectedQuote: (quote: SelectedQuote) => {
        set({ selectedQuote: quote });
      },
      clearSelectedQuote: () => {
        set({ selectedQuote: null });
      },
      setOrderResult: (orderId: string, result: OrderResult) => {
        set((state) => ({
          orderResultsById: {
            ...state.orderResultsById,
            [orderId]: result,
          },
        }));
      },
      clearOrderResult: (orderId: string) => {
        set((state) => {
          const nextOrderResults = { ...state.orderResultsById };
          delete nextOrderResults[orderId];

          return {
            orderResultsById: nextOrderResults,
          };
        });
      },
    }),
    {
      name: PLACE_ORDER_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        orderResultsById: state.orderResultsById,
      }),
    },
  ),
);
