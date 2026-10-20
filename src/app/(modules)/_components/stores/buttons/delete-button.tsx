import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Trash2Icon } from "lucide-react";

import { Tooltip } from "~/components/ui/tooltip";
import { LoadingButton } from "~/components/ui/button";
import { deleteAction } from "../actions/delete-action";

type DeleteButtonProps = {
  storeId: number | string;
};

export function DeleteButton({ storeId }: DeleteButtonProps) {
  const t = useTranslations("HomePage.stores.table");

  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    console.warn("TODO: Add confirmation alert");
    startTransition(async () => await deleteAction(storeId));
  };

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
