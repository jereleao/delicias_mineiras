"use client";

import { useTranslations } from "next-intl";
import { Button } from "~/components/ui/button";
import { DialogButton } from "~/components/dialog-button";
import { CategoryForm } from "./category-form";
import { PlusIcon } from "lucide-react";

export function NewCategoryButton() {
  const t = useTranslations("AdminPage.categories.table");

  return (
    <DialogButton
      title="New Category"
      description="Create a new product category"
      trigger={
        <Button variant="outline" size="icon-sm">
          <PlusIcon className="h-4 w-4" />
        </Button>
      }
    >
      <CategoryForm />
    </DialogButton>
  );
}
