import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Tooltip } from "~/components/ui/tooltip";
import { LoadingButton } from "~/components/ui/button";
import { BanIcon } from "lucide-react";
import { inactivateAction } from "../../_actions/inactivate-action";

type InactivateProductButtonProps = {
  productId: number | string;
};

export function InactivateProductButton({
  productId,
}: InactivateProductButtonProps) {
  const t = useTranslations("AdminPage.products.table");
  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => await inactivateAction(productId));

  return (
    <Tooltip content={t("actions.inactivate")}>
      <LoadingButton
        variant="ghost"
        size="icon-sm"
        className="hover:bg-primary/10"
        isLoading={isPending}
        replace
        onClick={handleClick}
      >
        <BanIcon className="size-4" />
        <span className="sr-only">{t("actions.inactivate")}</span>
      </LoadingButton>
    </Tooltip>
  );
}
