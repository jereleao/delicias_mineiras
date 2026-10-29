import { useSession } from "next-auth/react";
import { isAllowed, type PermissionKey } from "~/libs/auth/menus";
import { useStoreScopeId } from "~/libs/stores/store-scope-context";

function useHasPermission(permission: PermissionKey) {
  const { data: session } = useSession();
  const storeId = useStoreScopeId();

  if (!session?.user.permissions) return false;

  if (storeId === null) {
    return isAllowed(permission, session.user.permissions.platform);
  }

  return isAllowed(permission, [
    ...session.user.permissions.platform,
    ...(session.user.permissions.stores[storeId] ?? []),
  ]);
}

export default useHasPermission;
