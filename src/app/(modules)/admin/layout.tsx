import { AdminDrawerMenu } from "./_components/navigation-drawer";
import { AdminNavigationMenu } from "./_components/navigation-menu";
import { RigthMenuSlot } from "./_components/rigth-menu-slot";

type AdminLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="relative h-full pt-7.25">
      <div className="absolute top-0 left-0 w-[calc(100%-2rem)] pt-1">
        <div className="flex justify-between">
          <AdminNavigationMenu className="hidden sm:block" />
          <AdminDrawerMenu className="block sm:hidden" />
          <RigthMenuSlot />
        </div>
      </div>
      {children}
    </div>
  );
}
