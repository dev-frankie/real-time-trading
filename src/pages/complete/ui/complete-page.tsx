import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

import { usePlaceOrderStore } from "@/features/place-order";
import { formatNumber } from "@/shared/lib/number-format";
import { PageLayout } from "@/shared/ui/page-layout";
import { UiDiv, UiH1, UiSection } from "@/shared/ui/semantic";

export function CompletePage(): ReactElement {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderResultsById = usePlaceOrderStore((state) => state.orderResultsById);
  const clearOrderResult = usePlaceOrderStore((state) => state.clearOrderResult);
  const orderResult = orderId ? orderResultsById[orderId] : undefined;
  const cleanupCountRef = useRef(0);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    return () => {
      cleanupCountRef.current += 1;
      if (import.meta.env.DEV && cleanupCountRef.current === 1) {
        return;
      }
      clearOrderResult(orderId);
    };
  }, [clearOrderResult, orderId]);

  if (!orderResult) {
    return (
      <PageLayout width="narrow">
        <UiH1 className="m-0 mb-5">{t("complete.notFound")}</UiH1>
        <Link
          className="mt-[18px] inline-block rounded-sm bg-(--color-cta) px-3.5 py-2.5 text-(--color-on-accent) no-underline"
          to="/trade"
        >
          {t("complete.backToTrade")}
        </Link>
      </PageLayout>
    );
  }

  const summaryRows = [
    {
      label: t("complete.orderType"),
      value: orderResult.type === "buy" ? t("orderBook.buy") : t("orderBook.sell"),
    },
    { label: t("complete.price"), value: `${formatNumber(orderResult.price)} KRW` },
    { label: t("complete.quantity"), value: formatNumber(orderResult.quantity) },
    {
      label: t("complete.totalPrice"),
      value: `${formatNumber(orderResult.totalPrice)} KRW`,
    },
  ];

  return (
    <PageLayout width="narrow">
      <UiH1 className="m-0 mb-5">{t("complete.done")}</UiH1>
      <UiSection
        className="rounded-md border border-(--color-border-default) bg-(--color-bg-surface) p-[18px]"
        aria-label={t("complete.done")}
      >
        {summaryRows.map((row, index) => (
          <UiDiv
            key={row.label}
            className={`flex items-center justify-between gap-4 py-2.5 ${
              index === 0 ? "" : "border-t border-(--color-border-muted)"
            }`.trim()}
          >
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </UiDiv>
        ))}
      </UiSection>
      <Link
        className="mt-[18px] inline-block rounded-sm bg-(--color-cta) px-3.5 py-2.5 text-(--color-on-accent) no-underline"
        to="/trade"
      >
        {t("complete.backToTrade")}
      </Link>
    </PageLayout>
  );
}
