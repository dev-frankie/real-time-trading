import type { ReactElement } from "react";
import type { UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormItem } from "@/shared/ui/form-item";

import type { OrderQuantityFormValues } from "../model/order-quantity-schema";

interface OrderModalQuantityFieldProps {
  register: UseFormRegister<OrderQuantityFormValues>;
  errorMessage?: string;
}

export function OrderModalQuantityField({
  register,
  errorMessage,
}: OrderModalQuantityFieldProps): ReactElement {
  const { t } = useTranslation();

  return (
    <FormItem
      label={t("orderModal.quantityLabel")}
      htmlFor="order-quantity"
      {...(errorMessage
        ? {
            errorMessage,
          }
        : {})}
    >
      <input
        id="order-quantity"
        className="w-full rounded-sm border border-(--color-border-default) p-2.5"
        type="number"
        min={1}
        step={1}
        {...register("quantity", { valueAsNumber: true })}
      />
    </FormItem>
  );
}
