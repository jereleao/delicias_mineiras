"use client";

import { MenuIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  getPathByMenuKey,
  type MenuGroup,
  type MenuKey,
} from "~/libs/auth/menus";
import { useTranslations } from "next-intl";
import CustomLink from "~/components/custom-link";
import { useState } from "react";

type GenericMenuGroup = {
  menuGroup: MenuGroup["menuGroup"];
  menus: Array<{
    menuKey: MenuKey;
  }>;
};

type ClientDrawerProps = Readonly<{
  menus: Array<GenericMenuGroup>;
  className?: string;
}>;

export function ClientDrawer({ menus, className }: ClientDrawerProps) {
  const t = useTranslations("NavigationMenu");

  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <Drawer direction="left" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="capitalize">
            <MenuIcon className="" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
          <DrawerHeader>
            <DrawerTitle>{t("menuLabel")}</DrawerTitle>
          </DrawerHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            <Accordion type="multiple">
              {menus.map((menu) => (
                <AccordionItem
                  key={menu.menuGroup}
                  value={menu.menuGroup}
                  className="border-0!"
                >
                  <AccordionTrigger className="bg-secondary text-secondary-foreground my-1 w-full px-2 py-1 text-sm font-medium">
                    {t(`groups.${menu.menuGroup}`)}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <ul className="pt-1">
                      {menu.menus.map(({ menuKey }) => (
                        <li
                          key={menuKey}
                          className="ml-4 flex flex-1 items-start pb-2 text-left text-sm font-medium not-last:pb-3 disabled:pointer-events-none disabled:opacity-50"
                        >
                          <CustomLink
                            href={getPathByMenuKey(menuKey)}
                            className="w-full no-underline!"
                            onClick={() => setOpen(false)}
                          >
                            <div className="border-b pb-1 leading-none font-medium">
                              {t(menuKey)}
                            </div>
                          </CustomLink>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
