import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { deleteAction } from "../../_actions/delete-action";
import { Tooltip } from "~/components/ui/tooltip";
import { LoadingButton } from "~/components/ui/button";
import { Trash2Icon } from "lucide-react";

type DeleteButtonProps = {
  bannerId: number | string;
};

export function DeleteButton({ bannerId }: DeleteButtonProps) {
  const t = useTranslations("AdminPage.banners.table");

  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => await deleteAction(bannerId));

  return (
    <Tooltip content={t("actions.delete")}>
      <LoadingButton
        variant="ghost"
        size="icon-sm"
        className="hover:bg-primary/10"
        isLoading={isPending}
        replace
        onClick={handleClick}
      >
        <Trash2Icon className="stroke-destructive size-4" />
        <span className="sr-only">{t("actions.delete")}</span>
      </LoadingButton>
    </Tooltip>
  );
}
