import type React from "react";

type ConditionGuardProps = {
  /**
   * The condition that determines wheather to show the children or the fallback
   */
  condition: boolean;
  /**
   * Content to render when the condition is false
   * @default null
   */
  fallback?: React.ReactNode;
};

export default function ConditionGuard({
  children,
  condition,
  fallback = null,
}: React.PropsWithChildren<ConditionGuardProps>) {
  if (condition) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
