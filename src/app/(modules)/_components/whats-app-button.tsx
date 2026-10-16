import Link from "next/link";
import { WhatsAppColor, WhatsAppIconWhite } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { api } from "~/libs/trpc/server";

interface WhatsAppButtonProps {
  message?: string;
}

export async function WhatsAppButton({ message }: WhatsAppButtonProps) {
  const configuration = await api.config.whatsConfig();

  const greeting = message || configuration.greeting;

  const whatsAppLink = `https://wa.me/${configuration.phoneNumber}?text=${encodeURIComponent(greeting)}`;

  return (
    <Link
      href={whatsAppLink}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
    >
      <Button
        className="size-12 rounded-full p-1.5"
        style={{
          backgroundColor: WhatsAppColor,
        }}
      >
        <WhatsAppIconWhite className="size-7" />
      </Button>
    </Link>
  );
}
