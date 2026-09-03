import { useTranslations } from "next-intl";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { PencilIcon } from "lucide-react";
import { DialogButton } from "~/components/dialog-button";
import type { Category } from "~/libs/api/routers/category";
import { CategoryForm } from "../category-form";

type EditCategoryButtonProps = Category;

export function EditCategoryButton({ id, name }: EditCategoryButtonProps) {
  const t = useTranslations("AdminPage.categories.table");

  const category = {
    id,
    name,
  };

  return (
    <Tooltip content={t("actions.edit.title")}>
      <DialogButton
        title={t("actions.edit.title")}
        description={t("actions.edit.description")}
        className="md:max-w-3xl"
        ContentComponent={CategoryForm}
        category={category}
      >
        <Button variant="ghost" size="icon-sm" className="hover:bg-primary/10">
          <PencilIcon className="size-4" />
          <span className="sr-only">{t("actions.edit.title")}</span>
        </Button>
      </DialogButton>
    </Tooltip>
  );
}
