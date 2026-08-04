import { auth } from "~/libs/auth";
import { SignIn } from "~/components/auth-component";
import UserMenu from "~/components/user-menu";

export default async function UserButton() {
  const session = await auth();

  if (!session?.user) return <SignIn />;

  return <UserMenu session={session} />;
}
