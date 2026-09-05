"use client";

import {
  Form,
  FormInput,
  FormSelect,
  FormTextarea,
} from "~/components/form/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/libs/trpc/react";
import { useTransition, type Dispatch } from "react";
import { LoadingButton } from "~/components/ui/button";
import { useTranslations } from "next-intl";
import { userFormSchema, type UserFormType } from "../../_actions/user-schema";
import { updateUserAction } from "../../_actions/update-user-action";
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
      roleId: user.roleId.toString(),
    },
  });

  const [isPendingSave, startSaveTransition] = useTransition();

  const utils = api.useUtils();

  function onSubmit(data: UserFormType) {
    startSaveTransition(async () => {
      const changedUser = await updateUserAction(user.id, data);

      utils.user.all.setData(undefined, (old = []) =>
        old.map((o) => (o.id == changedUser?.id ? changedUser : o)),
      );

      await utils.user.all.invalidate();

      setOpen(false);
    });
  }

  return (
    <Form
      form={form}
      onValid={onSubmit}
      onInvalid={(errors, _event) => console.log("onInvalid: ", errors)}
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

      <FormSelect
        control={form.control}
        name="roleId"
        label={t("form.fields.role.label")}
        options={roleOptions.map((opt) => ({
          value: opt.id.toString(),
          label: t("roles", { opt: opt.name }),
        }))}
      />

      <div>
        <LoadingButton type="submit" isLoading={isPendingSave}>
          {t("form.submit")}
        </LoadingButton>
      </div>
    </Form>
  );
}
