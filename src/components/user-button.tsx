import { auth } from "~/libs/auth";
import { SignIn } from "~/components/auth-component";
import UserMenu from "~/components/user-menu";

type UserButtonProps = {
  showLoginOption?: boolean;
};

export default async function UserButton({ showLoginOption }: UserButtonProps) {
  const session = await auth();

  if (!session?.user) return showLoginOption ? <SignIn /> : null;

  return <UserMenu session={session} />;
}
