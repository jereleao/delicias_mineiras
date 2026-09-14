import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { WhatsAppColor, WhatsAppIconWhite } from "~/components/icons";
import { Button } from "~/components/ui/button";

export default async function WhatsAppButton() {
  const t = await getTranslations();

  const whatsAppNumber = "11920135602";

  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${t("AboutPage.title")}`;

  return (
    <Link href={whatsAppLink}>
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
