import { cn } from "~/utils/index";

export const skeletonClasses =
  "dark:bg-muted animate-pulse rounded-md bg-gray-300";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonClasses, className)}
      {...props}
    />
  );
}

export { Skeleton };
