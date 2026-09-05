import { useSession } from "next-auth/react";
import { isAllowed, type PermissionKey } from "~/libs/auth/menus";

function useHasPermission(permission: PermissionKey) {
  const { data: session } = useSession();
  const permissions = session?.user.permissions;

  if (!permissions) return false;

  return isAllowed(permission, permissions);
}

export default useHasPermission;
