"use client";

import type React from "react";
import useHasPermission from "~/hooks/use-has-permission";
import type { PermissionKey } from "~/libs/auth/menus";

type PermissionGuardProps = {
  /**
   * The authentication tag that determines whether to show the children or the fallback
   */
  permission: PermissionKey;
  /**
   * Content to render when the user doesn't have permission
   * @default null
   */
  fallback?: React.ReactNode;
};

export default function PermissionGuard({
  children,
  permission,
  fallback = null,
}: React.PropsWithChildren<PermissionGuardProps>) {
  const hasPermission = useHasPermission(permission);

  if (hasPermission) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
