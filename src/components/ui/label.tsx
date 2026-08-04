"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "~/utils/index";

type CustomLabelProps = {
  required?: boolean;
};

function Label({
  className,
  children,
  required,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & CustomLabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">{"*"}</span>}
    </LabelPrimitive.Root>
  );
}

export { Label };
