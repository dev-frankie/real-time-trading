import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface OrderModalActionsProps {
  onBuy: () => void;
  onSell: () => void;
}

export function OrderModalActions({
  onBuy,
  onSell,
}: OrderModalActionsProps): ReactElement {
  const { t } = useTranslation();

  return (
    <div className="mt-[18px] flex gap-2.5">
      <button
        type="button"
        className="flex-1 cursor-pointer rounded-sm border-0 bg-(--color-buy) py-2.5 font-semibold text-(--color-on-accent)"
        onClick={onBuy}
      >
        {t("orderModal.buy")}
      </button>
      <button
        type="button"
        className="flex-1 cursor-pointer rounded-sm border-0 bg-(--color-sell) py-2.5 font-semibold text-(--color-on-accent)"
        onClick={onSell}
      >
        {t("orderModal.sell")}
      </button>
    </div>
  );
}
