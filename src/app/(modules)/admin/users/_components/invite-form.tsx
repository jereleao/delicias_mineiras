"use client";

import { Form, FormInput, FormSelect } from "~/components/form/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/libs/trpc/react";
import { useTransition, type Dispatch } from "react";
import { LoadingButton } from "~/components/ui/button";
import { useTranslations } from "next-intl";
import type { Role } from "~/libs/api/routers/permissions";
import { inviteSchema, type InviteType } from "~/libs/db/schemas/users";
import { newUserAction } from "../_actions/new-user-action";

type UserFormProps = {
  setOpen: Dispatch<boolean>;
  roleOptions: Array<Role>;
};

export function InviteForm({ setOpen, roleOptions }: UserFormProps) {
  const t = useTranslations("AdminPage.users");

  const defaultRoleId = roleOptions.find((opt) => opt.name == "user")?.id;

  const form = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      roleId: defaultRoleId?.toString(),
    },
  });

  const [isPendingSave, startSaveTransition] = useTransition();

  const utils = api.useUtils();

  function onSubmit(data: InviteType) {
    startSaveTransition(async () => {
      const newUser = await newUserAction(data);

      utils.user.all.setData(undefined, (old = []) => [...old]);

      await utils.user.all.invalidate();
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
        name="email"
        label={t("form.fields.email.label")}
        placeholder={t("form.fields.email.placeholder")}
        autoComplete="off"
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
