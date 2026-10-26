import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Tooltip } from "~/components/ui/tooltip";
import { LoadingButton } from "~/components/ui/button";
import { CircleCheckBigIcon } from "lucide-react";
import { activateAction } from "../actions/activate-action";

type ActivateButtonProps = {
  storeId: number | string;
};

export function ActivateButton({ storeId }: ActivateButtonProps) {
  const t = useTranslations("HomePage.stores.table");
  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => await activateAction(storeId));

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
