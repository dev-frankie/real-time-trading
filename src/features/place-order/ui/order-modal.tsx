import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { OrderType } from "@/entities/orderbook";
import { UiDialog } from "@/shared/ui/semantic";

import {
  createOrderQuantitySchema,
  type OrderQuantityFormValues,
} from "../model/order-quantity-schema";
import { createOrderResult } from "../model/place-order";
import { OrderModalActions } from "./order-modal-actions";
import { OrderModalHeader } from "./order-modal-header";
import { OrderModalQuantityField } from "./order-modal-quantity-field";

interface OrderModalProps {
  isOpen: boolean;
  price: number;
  availableQuantity: number;
  onClose: () => void;
  onSubmit: (result: ReturnType<typeof createOrderResult>) => void;
}

export function OrderModal({
  isOpen,
  price,
  availableQuantity,
  onClose,
  onSubmit,
}: OrderModalProps): ReactElement {
  const { t } = useTranslation();
  const orderQuantitySchema = createOrderQuantitySchema(t);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<OrderQuantityFormValues>({
    defaultValues: {
      quantity: 1,
    },
    resolver: zodResolver(orderQuantitySchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleDialogClose = (): void => {
    reset({ quantity: 1 });
    onClose();
  };

  const closeModal = (): void => {
    dialogRef.current?.close();
  };

  const submitOrder = (type: OrderType, values: OrderQuantityFormValues): void => {
    if (values.quantity > availableQuantity) {
      setError("quantity", {
        type: "manual",
        message: t("orderModal.errors.exceed", { quantity: availableQuantity }),
      });
      return;
    }

    clearErrors("quantity");

    const result = createOrderResult({
      type,
      price,
      quantity: values.quantity,
    });

    closeModal();
    onSubmit(result);
    reset({ quantity: 1 });
  };

  return (
    <UiDialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 m-0 w-[min(92vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-md border-0 bg-(--color-bg-surface) p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop:bg-(--color-overlay)"
      onClose={handleDialogClose}
      onCancel={(event) => {
        event.preventDefault();
        closeModal();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <OrderModalHeader price={price} availableQuantity={availableQuantity} />

      <OrderModalQuantityField
        register={register}
        {...(errors.quantity?.message
          ? {
              errorMessage: errors.quantity.message,
            }
          : {})}
      />

      <OrderModalActions
        onBuy={() => {
          void handleSubmit((values) => {
            submitOrder("buy", values);
          })();
        }}
        onSell={() => {
          void handleSubmit((values) => {
            submitOrder("sell", values);
          })();
        }}
      />
    </UiDialog>
  );
}
