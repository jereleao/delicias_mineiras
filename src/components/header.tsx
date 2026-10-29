import { cn } from "~/utils";

import { UserButton } from "~/components/user-button";
import { LogoLinkHome } from "~/components/logo-link-home";
import { DrawerMenu } from "./navigation/drawer-menu";
import { NavigationMenu } from "./navigation/navigation-menu";

type HeaderProps = {
  className?: string;
};

export default async function Header({ className }: HeaderProps) {
  return (
    <header className={cn("flex justify-center", className)}>
      <div className="container mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <DrawerMenu className="block sm:hidden" />
          <LogoLinkHome />
          <NavigationMenu className="hidden sm:block" />
        </div>
        <UserButton />
      </div>
    </header>
  );
}
