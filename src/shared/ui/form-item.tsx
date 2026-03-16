import type { PropsWithChildren, ReactElement } from "react";

interface FormItemProps extends PropsWithChildren {
  label: string;
  htmlFor: string;
  errorMessage?: string;
}

export function FormItem({
  label,
  htmlFor,
  errorMessage,
  children,
}: FormItemProps): ReactElement {
  return (
    <div>
      <label className="mb-2 block text-sm" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {errorMessage ? (
        <p className="mt-2 mb-0 text-sm text-(--color-sell)" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
