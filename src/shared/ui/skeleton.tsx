import type { ReactElement } from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps): ReactElement {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-sm bg-(--color-border-default) ${className}`.trim()}
    />
  );
}
