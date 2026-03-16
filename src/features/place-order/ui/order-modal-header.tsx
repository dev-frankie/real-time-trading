import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";

import { formatNumber } from "@/shared/lib/number-format";
import { UiH2 } from "@/shared/ui/semantic";

interface OrderModalHeaderProps {
  price: number;
  availableQuantity: number;
}

export function OrderModalHeader({
  price,
  availableQuantity,
}: OrderModalHeaderProps): ReactElement {
  const { t } = useTranslation();

  return (
    <>
      <UiH2 id="order-modal-title" className="m-0 mb-3 text-xl">
        {t("orderModal.title")}
      </UiH2>
      <p className="m-0 mb-4 text-(--color-text-secondary)">
        {t("orderModal.selectedPrice", { price: formatNumber(price) })}
      </p>
      <p className="m-0 mb-4 text-sm text-(--color-text-secondary)">
        {t("orderModal.availableQuantity", { quantity: formatNumber(availableQuantity) })}
      </p>
    </>
  );
}
