import UserButton from "~/components/user-button";
import { cn } from "~/utils";
import { LogoLinkHome } from "~/components/logo-link-home";

type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  return (
    <header className={cn("flex justify-center", className)}>
      <div className="container mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <LogoLinkHome />
        <UserButton />
      </div>
    </header>
  );
}
