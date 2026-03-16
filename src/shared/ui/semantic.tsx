import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

export function UiH1(props: ComponentPropsWithoutRef<"h1">): ReactElement {
  return <h1 {...props} />;
}

export function UiH2(props: ComponentPropsWithoutRef<"h2">): ReactElement {
  return <h2 {...props} />;
}

export function UiSection(props: ComponentPropsWithoutRef<"section">): ReactElement {
  return <section {...props} />;
}

export function UiDiv(props: ComponentPropsWithoutRef<"div">): ReactElement {
  return <div {...props} />;
}

export const UiDialog = forwardRef<HTMLDialogElement, ComponentPropsWithoutRef<"dialog">>(
  (props, ref): ReactElement => {
    return <dialog ref={ref} {...props} />;
  },
);

UiDialog.displayName = "UiDialog";
