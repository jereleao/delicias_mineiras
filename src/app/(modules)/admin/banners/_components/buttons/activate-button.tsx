import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Tooltip } from "~/components/ui/tooltip";
import { LoadingButton } from "~/components/ui/button";
import { CircleCheckBigIcon } from "lucide-react";
import { activateAction } from "../../_actions/activate-action";

type ActivateButtonProps = {
  bannerId: number | string;
};

export function ActivateButton({ bannerId }: ActivateButtonProps) {
  const t = useTranslations("AdminPage.banners.table");
  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => await activateAction(bannerId));

  return (
    <Tooltip content={t("actions.activate")}>
      <LoadingButton
        variant="ghost"
        size="icon-sm"
        className="hover:bg-primary/10"
        isLoading={isPending}
        replace
        onClick={handleClick}
      >
        <CircleCheckBigIcon className="size-4" />
        <span className="sr-only">{t("actions.activate")}</span>
      </LoadingButton>
    </Tooltip>
  );
}
