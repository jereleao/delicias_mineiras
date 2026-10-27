"use client";

import {
  Form,
  FormInput,
  FormTextarea,
} from "~/components/form/client";
import { Checkbox } from "~/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/libs/trpc/react";
import { useTransition, type Dispatch } from "react";
import { LoadingButton } from "~/components/ui/button";
import { useTranslations } from "next-intl";
import { userFormSchema, type UserFormType } from "../_actions/user-schema";
import { updateAction } from "../_actions/update-action";
import type { Role } from "~/libs/api/routers/permissions";

type UserFormProps = {
  setOpen: Dispatch<boolean>;
  user: UserFormType;
  roleOptions: Array<Role>;
};

export function UserForm({ setOpen, user, roleOptions }: UserFormProps) {
  const t = useTranslations("AdminPage.users");

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      bio: user.bio ?? "",
      roleIds: user.roleIds,
    },
  });
  const selectedRoleIds = form.watch("roleIds");

  const [isPendingSave, startSaveTransition] = useTransition();

  const utils = api.useUtils();

  function onSubmit(data: UserFormType) {
    startSaveTransition(async () => {
      const changedUser = await updateAction(user.id, data);

      utils.user.allPlatform.setData(undefined, (old = []) =>
        old.map((o) => (o.id == changedUser?.id ? changedUser : o)),
      );

      await utils.user.allPlatform.invalidate();

      setOpen(false);
    });
  }

  return (
    <Form
      form={form}
      onValid={onSubmit}
      onInvalid={(errors, _event) => console.warn("onInvalid: ", errors)}
    >
      <FormInput
        control={form.control}
        name="name"
        label={t("form.fields.name.label")}
        placeholder={t("form.fields.name.placeholder")}
        autoComplete="off"
      />

      <FormTextarea
        control={form.control}
        name="bio"
        label={t("form.fields.bio.label")}
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          {t("form.fields.role.label")}
        </legend>
        {roleOptions.map(({ id, name, description }) => (
          <label key={id} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={selectedRoleIds.includes(id)}
              onCheckedChange={(checked) => {
                const nextRoleIds = checked
                  ? [...selectedRoleIds, id]
                  : selectedRoleIds.filter((roleId) => roleId !== id);
                form.setValue("roleIds", nextRoleIds, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
            <span>
              {t("roles", { opt: name })}
              {description ? ` — ${description}` : ""}
            </span>
          </label>
        ))}
      </fieldset>

      <div>
        <LoadingButton type="submit" isLoading={isPendingSave}>
          {t("form.submit")}
        </LoadingButton>
      </div>
    </Form>
  );
}
