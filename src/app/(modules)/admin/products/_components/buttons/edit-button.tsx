import { useTranslations } from "next-intl";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { PencilIcon } from "lucide-react";
import type { NewProductFormType } from "../../_actions/new-product-schema";
import { DialogButton } from "~/components/dialog-button";
import { ProductForm } from "../product-form";

type EditProductButtonProps = {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  keywords: string | null;
  categoryName: string | null;
  active: boolean | null;
};

export function EditProductButton({
  id,
  categoryId,
  name,
  description,
  price,
  imageUrl,
  keywords,
}: EditProductButtonProps) {
  const t = useTranslations("AdminPage.products.table");

  const product: NewProductFormType = {
    id,
    categoryId: categoryId.toString(),
    name,
    description: description ?? null,
    price: Number(price),
    imageUrl: imageUrl ?? "",
    keywords: keywords ? keywords.split("|").map((word) => ({ word })) : null,
  };

  return (
    <Tooltip content={t("actions.edit.title")}>
      <DialogButton
        title={t("actions.edit.title")}
        description={t("actions.edit.description")}
        className="md:max-w-3xl"
        ContentComponent={ProductForm}
        product={product}
      >
        <Button variant="ghost" size="icon-sm" className="hover:bg-primary/10">
          <PencilIcon className="size-4" />
          <span className="sr-only">{t("actions.edit.title")}</span>
        </Button>
      </DialogButton>
    </Tooltip>
  );
}
