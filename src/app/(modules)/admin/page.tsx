import { redirect } from "next/navigation";
import { getPathByMenuKey } from "~/libs/auth/menus";

export default function AdminIndexPage() {
  redirect(getPathByMenuKey("admin.products"));
}
