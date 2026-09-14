import Link from "next/link";
import { WhatsAppColor, WhatsAppIconWhite } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { api } from "~/libs/trpc/server";

export default async function WhatsAppButton() {
  const configuration = await api.config.whatsConfig();

  const whatsAppLink = `https://wa.me/${configuration.phoneNumber}?text=${encodeURIComponent(configuration.greeting)}`;

  return (
    <Link href={whatsAppLink} target="_blank">
      <Button
        className="size-11 rounded-full p-1.5"
        style={{
          backgroundColor: WhatsAppColor,
        }}
      >
        <WhatsAppIconWhite className="size-7" />
      </Button>
    </Link>
  );
}
