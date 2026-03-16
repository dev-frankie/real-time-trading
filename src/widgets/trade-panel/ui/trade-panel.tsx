import type { ReactElement } from "react";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";

import type { OrderItem } from "@/entities/orderbook";
import { PageLayout } from "@/shared/ui/page-layout";
import { LanguageToggle } from "@/shared/ui/language-toggle";
import { UiH1, UiSection } from "@/shared/ui/semantic";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { OrderBookSkeleton } from "@/widgets/order-book/ui/order-book-skeleton";

const LazyOrderBook = lazy(() =>
  import("@/widgets/order-book/ui/order-book").then((module) => ({
    default: module.OrderBook,
  })),
);

interface TradePanelProps {
  items: OrderItem[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
  onSelectOrder: (item: OrderItem) => void;
}

export function TradePanel({
  items,
  isLoading,
  isError,
  isFetching,
  onRetry,
  onSelectOrder,
}: TradePanelProps): ReactElement {
  const { t } = useTranslation();

  return (
    <PageLayout width="wide" className="flex h-dvh flex-col overflow-hidden pt-8 pb-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <UiH1 className="m-0 text-[28px]">{t("trade.title")}</UiH1>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
      <p className="mt-2 mb-5 text-(--color-text-secondary)">{t("trade.subtitle")}</p>

      <div className="min-h-0 flex-1">
        {isLoading ? (
          <OrderBookSkeleton />
        ) : isError ? (
          <UiSection className="mx-auto flex h-full w-full max-w-[680px] flex-col items-center justify-center rounded-md border border-(--color-border-default) bg-(--color-bg-surface) p-6 text-center">
            <p className="m-0 mb-3 text-(--color-sell)">{t("trade.fetchError")}</p>
            <button
              type="button"
              className="cursor-pointer rounded-sm border border-(--color-border-default) bg-(--color-bg-page) px-4 py-2 text-sm font-medium text-(--color-text-primary) hover:bg-(--color-border-muted) disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isFetching}
              onClick={onRetry}
            >
              {isFetching ? t("trade.retrying") : t("trade.retry")}
            </button>
          </UiSection>
        ) : (
          <Suspense fallback={<OrderBookSkeleton />}>
            <LazyOrderBook items={items} onSelectOrder={onSelectOrder} />
          </Suspense>
        )}
      </div>
    </PageLayout>
  );
}
