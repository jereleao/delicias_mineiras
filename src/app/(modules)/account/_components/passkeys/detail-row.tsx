import type { ReactNode } from "react";
import { cn } from "~/utils";

type DetailRowProps = {
  label: ReactNode;
  value: ReactNode;
  mono?: boolean;
};

export function DetailRow({ label, value, mono }: DetailRowProps) {
  return (
    <div>
      <dt className="text-foreground h-5 text-[15px]">{label}</dt>
      <dd
        className={cn(
          "text-muted-foreground h-5 text-sm",
          mono && "font-mono leading-relaxed break-all",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
