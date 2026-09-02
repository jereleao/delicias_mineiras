"use client";

import { useTranslations } from "next-intl";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { PencilIcon } from "lucide-react";
import { DialogButton } from "~/components/dialog-button";
import { CategoryForm } from "../category-form";
import type { Category } from "~/libs/api/routers/category";

type EditCategoryButtonProps = Category;

export function EditCategoryButton({ id, name }: EditCategoryButtonProps) {
  const t = useTranslations("AdminPage.categories.table");

  return (
    <DialogButton
      title="Edit Category"
      description={`Update category: ${name}`}
      trigger={
        <Tooltip content="Edit">
          <Button variant="ghost" size="icon-sm" className="hover:bg-primary/10">
            <PencilIcon className="h-4 w-4" />
          </Button>
        </Tooltip>
      }
    >
      <CategoryForm category={{ id, name }} />
    </DialogButton>
  );
}
