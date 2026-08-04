import Image from "next/image";
import { cn } from "~/utils";

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/g-logo.png"
      alt="Google Logo"
      width={20}
      height={20}
      className={className}
    />
  );
}

export function AppleIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/apple-logo-black.svg"
      alt="Apple Logo"
      width={20}
      height={20}
      className={className}
    />
  );
}

export function Windows10Icon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/win10-logo.png"
      alt="Windows 10 Logo"
      width={20}
      height={20}
      className={cn("p-0.75", className)}
    />
  );
}

export function Windows11Icon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/win11-logo.png"
      alt="Windows 11 Logo"
      width={20}
      height={20}
      className={className}
    />
  );
}
