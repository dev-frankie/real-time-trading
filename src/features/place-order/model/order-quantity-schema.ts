import type { TFunction } from "i18next";
import { z } from "zod";

export function createOrderQuantitySchema(
  t: TFunction<"translation", undefined>,
): z.ZodObject<{
  quantity: z.ZodNumber;
}> {
  return z.object({
    quantity: z
      .number({
        error: t("orderModal.errors.requiredNumber"),
      })
      .int(t("orderModal.errors.integer"))
      .min(1, t("orderModal.errors.min")),
  });
}

export type OrderQuantityFormValues = z.infer<
  ReturnType<typeof createOrderQuantitySchema>
>;
