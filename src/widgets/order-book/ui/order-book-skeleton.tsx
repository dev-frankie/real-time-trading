import type { ReactElement } from "react";

import { Skeleton } from "@/shared/ui/skeleton";

const SKELETON_ROWS = 12;

export function OrderBookSkeleton(): ReactElement {
  return (
    <section
      className="mx-auto flex h-full w-full max-w-[680px] flex-col overflow-hidden rounded-md border border-(--color-border-default) bg-(--color-bg-surface)"
      aria-label="호가창 로딩"
    >
      <div className="grid grid-cols-[120px_1fr_120px] bg-(--color-bg-page) px-4 py-3">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-12" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <div
            key={`orderbook-skeleton-row-${index}`}
            className="grid grid-cols-[120px_1fr_120px] items-center border-t border-(--color-border-muted) px-4 py-3 first:border-t-0"
          >
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-10" />
          </div>
        ))}
      </div>
    </section>
  );
}
