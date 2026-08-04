"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/utils";
import { FileText, Plus, SquareKanban } from "lucide-react";

const menuList = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: SquareKanban,
  },
] as const;

export function MainNav() {
  return (
    <div className="flex min-h-16 w-full items-center justify-center gap-4">
      <NavigationMenu top>
        <NavigationMenuList className="flex w-full justify-center">
          {menuList.map((menu) => {
            const Icon = menu.icon;
            return (
              <NavigationMenuItem key={menu.href}>
                <NavigationMenuLink
                  title={menu.name}
                  href={menu.href}
                  className={navigationMenuTriggerStyle()}
                >
                  <Icon className="size-7" />
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
          {/* <NavigationMenuItem>
            <NavigationMenuTrigger className="h-9 px-2.5 py-1.5">
              <FileText className="size-7" />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]">
                <ListItem href="/server-example" title="RSC Example">
                  Protecting React Server Component.
                </ListItem>
                <ListItem href="/middleware-example" title="Middleware Example">
                  Using Middleware to protect pages & APIs.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem> */}
          {/* <NavigationMenuItem>
            <NavigationMenuLink
              href="/operations"
              className={navigationMenuTriggerStyle()}
            >
              <FileText className="size-7" />
            </NavigationMenuLink>
          </NavigationMenuItem> */}
          {/* <NavigationMenuItem>
            <NavigationMenuLink
              href="/operations/new"
              className={navigationMenuTriggerStyle()}
            >
              <Plus className="size-7" />
            </NavigationMenuLink>
          </NavigationMenuItem> */}

          {/* <NavigationMenuItem>
            <NavigationMenuLink
              href="/dashboard"
              className={navigationMenuTriggerStyle()}
            >
              <SquareKanban className="size-7" />
            </NavigationMenuLink>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
