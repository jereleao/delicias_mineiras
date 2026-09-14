"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { LoaderCircleIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { SignOut } from "~/components/auth-component";
import { logoutAction } from "~/libs/auth/actions";
import UserAvatar from "~/components/user-avatar";
import UserMenuLanguage from "~/components/user-menu-language";
import UserMenuTheme from "~/components/user-menu-theme";
import { Skeleton } from "~/components/ui/skeleton";

type UserMenuProps = { session: Session };

export default function UserMenu({ session }: UserMenuProps) {
  const [isLogingOut, startLogout] = useTransition();

  const handleLogout = () => startLogout(() => logoutAction());

  const t = useTranslations();

  if (isLogingOut)
    return (
      <div className="flex items-center gap-2">
        {/* <Skeleton className="bg-muted-foreground h-3 w-16" /> */}
        <Skeleton className="bg-muted-foreground size-8 rounded-full" />
      </div>
    );

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative size-8 rounded-full">
            <UserAvatar image={session.user.image} name={session.user.name} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {session.user.name}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account">{t("AccountPage.title")}</Link>
          </DropdownMenuItem>
          <UserMenuLanguage />
          <UserMenuTheme />
          <DropdownMenuItem>
            <SignOut handleLogout={handleLogout} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
