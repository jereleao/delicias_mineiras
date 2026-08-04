import { Home } from "lucide-react";
import { Button } from "~/components/ui/button";
import CustomLink from "~/components/custom-link";
import UserButton from "~/components/user-button";

export default function Header() {
  return (
    <header className="flex justify-center border-b">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <CustomLink href="/">
          <Button
            variant="ghost"
            className="border-foreground size-8 rounded-full border p-0"
          >
            <Home className="min-w-8" />
          </Button>
        </CustomLink>
        <UserButton />
      </div>
    </header>
  );
}
