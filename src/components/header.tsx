import Image from "next/image";
import CustomLink from "~/components/custom-link";
import UserButton from "~/components/user-button";
import { cn } from "~/utils";

type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  return (
    <header className={cn("flex justify-center", className)}>
      <div className="container mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <CustomLink href="/">
          <Image
            src="https://placehold.co/100x32"
            alt="Logo"
            width={100}
            height={32}
            unoptimized
          />
        </CustomLink>
        <UserButton />
      </div>
    </header>
  );
}
