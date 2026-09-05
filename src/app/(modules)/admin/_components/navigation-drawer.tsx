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
import { isAllowed, MENUS } from "~/libs/auth/menus";
import { getTranslations } from "next-intl/server";
import CustomLink from "~/components/custom-link";
import { auth } from "~/libs/auth";

type AdminDrawerMenuProps = Readonly<{
  className?: string;
}>;

export async function AdminDrawerMenu({ className }: AdminDrawerMenuProps) {
  const t = await getTranslations("NavigationMenu");

  const session = await auth();

  const allowedMenus = MENUS.map(({ menuGroup, menus }) => ({
    menuGroup,
    menus: menus.filter(({ menuKey }) =>
      isAllowed(menuKey, session?.user.permissions ?? []),
    ),
  })).filter(({ menus }) => menus.length > 0);

  return (
    <div className={className}>
      <Drawer direction="left">
        <DrawerTrigger asChild>
          <Button variant="outline" className="capitalize">
            <MenuIcon className="" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
          <DrawerHeader>
            <DrawerTitle>{t("menus")}</DrawerTitle>
          </DrawerHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            <Accordion type="multiple">
              {allowedMenus.map((menu) => (
                <AccordionItem
                  key={menu.menuGroup}
                  value={menu.menuGroup}
                  className="border-0!"
                >
                  <AccordionTrigger className="bg-secondary text-secondary-foreground my-1 w-full px-2 py-1 text-sm font-medium">
                    {t(menu.menuGroup)}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <ul className="pt-1">
                      {menu.menus.map((subMenu) => (
                        <li
                          key={subMenu.menuKey + subMenu.href}
                          className="ml-4 flex flex-1 items-start pb-2 text-left text-sm font-medium not-last:pb-3 disabled:pointer-events-none disabled:opacity-50"
                        >
                          <CustomLink
                            href={subMenu.href}
                            className="w-full no-underline!"
                          >
                            <div className="border-b pb-1 leading-none font-medium">
                              {t(subMenu.menuKey)}
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
