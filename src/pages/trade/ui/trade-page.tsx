import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import type { OrderResult } from "@/entities/orderbook";
import { createOrderId, OrderModal, usePlaceOrderStore } from "@/features/place-order";
import { useOrderbookStream } from "@/widgets/order-book";
import { TradePanel } from "@/widgets/trade-panel";

export function TradePage(): ReactElement {
  const navigate = useNavigate();
  const { items, isLoading, isError, isFetching, refetch } = useOrderbookStream();
  const selectedQuote = usePlaceOrderStore((state) => state.selectedQuote);
  const setSelectedQuote = usePlaceOrderStore((state) => state.setSelectedQuote);
  const clearSelectedQuote = usePlaceOrderStore((state) => state.clearSelectedQuote);
  const setOrderResult = usePlaceOrderStore((state) => state.setOrderResult);

  const handleSubmitOrder = (result: OrderResult): void => {
    const orderId = createOrderId();

    clearSelectedQuote();
    setOrderResult(orderId, result);
    navigate(`/complete?orderId=${encodeURIComponent(orderId)}`);
  };

  return (
    <>
      <TradePanel
        items={items}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        onRetry={() => {
          void refetch();
        }}
        onSelectOrder={(item) => {
          setSelectedQuote({
            price: item.price,
            quantity: item.quantity,
          });
        }}
      />

      <OrderModal
        isOpen={selectedQuote !== null}
        price={selectedQuote?.price ?? 0}
        availableQuantity={selectedQuote?.quantity ?? 0}
        onClose={() => {
          clearSelectedQuote();
        }}
        onSubmit={handleSubmitOrder}
      />
    </>
  );
}
