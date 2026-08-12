import Link from "next/link";
import { cn } from "~/utils";
import { ExternalLinkIcon } from "lucide-react";

interface CustomLinkProps extends React.LinkHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const CustomLink = ({
  href,
  children,
  className,
  ...rest
}: CustomLinkProps) => {
  const isInternalLink = href.startsWith("/");
  const isAnchorLink = href.startsWith("#");

  if (isInternalLink || isAnchorLink) {
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 align-baseline underline underline-offset-4",
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      <ExternalLinkIcon className="ml-0.5 inline-block size-4" />
    </Link>
  );
};

export default CustomLink;
