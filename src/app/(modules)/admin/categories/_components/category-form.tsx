"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, LoadingButton } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { updateCategoryAction } from "../_actions/update-category-action";
import { addNewCategory } from "../_actions/add-new-category-action";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export type CategoryFormType = z.infer<typeof categoryFormSchema>;

type CategoryFormProps = {
  category?: {
    id: number;
    name: string | null;
  };
  onSuccess?: () => void;
};

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormType>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  const onSubmit = (data: CategoryFormType) => {
    startTransition(async () => {
      if (category) {
        await updateCategoryAction(category.id, data.name);
      } else {
        await addNewCategory(data.name);
      }
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter category name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <LoadingButton type="submit" isLoading={isPending}>
        {category ? "Update Category" : "Create Category"}
      </LoadingButton>
    </form>
  );
}
