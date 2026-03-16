import type { PropsWithChildren, ReactElement } from "react";

interface PageLayoutProps extends PropsWithChildren {
  width: "wide" | "narrow";
  className?: string;
}

const WIDTH_CLASS_MAP: Record<PageLayoutProps["width"], string> = {
  wide: "max-w-[860px]",
  narrow: "max-w-[520px]",
};

export function PageLayout({
  width,
  className,
  children,
}: PageLayoutProps): ReactElement {
  const optionalClassName = className ? ` ${className}` : "";

  return (
    <main className={`mx-auto ${WIDTH_CLASS_MAP[width]} px-4 py-10${optionalClassName}`}>
      {children}
    </main>
  );
}
