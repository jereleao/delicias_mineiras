"use client";

import { Form, FormInput, FormMultiSelect } from "~/components/form/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/libs/trpc/react";
import { useTransition, type Dispatch } from "react";
import { LoadingButton } from "~/components/ui/button";
import { useTranslations } from "next-intl";
import type { RoleOption } from "~/libs/api/routers/permissions";
import { inviteSchema, type InviteType } from "~/libs/db/schemas/users";
import { newAction } from "../_actions/new-action";

type UserFormProps = {
  setOpen: Dispatch<boolean>;
  roleOptions: Array<RoleOption>;
};

export function InviteForm({ setOpen, roleOptions }: UserFormProps) {
  const t = useTranslations("AdminPage.users");

  const defaultRoleId = roleOptions.find((opt) => opt.key == "user")?.id;

  const form = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      roleIds: defaultRoleId ? [defaultRoleId] : [],
    },
  });

  const [isPendingSave, startSaveTransition] = useTransition();

  const utils = api.useUtils();

  function onSubmit(data: InviteType) {
    startSaveTransition(async () => {
      const newUser = await newAction(data);

      if (newUser)
        utils.user.allPlatform.setData(undefined, (old = []) => [
          ...old,
          newUser,
        ]);

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
        name="email"
        label={t("form.fields.email.label")}
        placeholder={t("form.fields.email.placeholder")}
        autoComplete="off"
      />

      <FormMultiSelect
        control={form.control}
        name="roleIds"
        label={t("form.fields.role.label")}
        options={roleOptions.map((r) => ({
          value: r.id.toString(),
          label: r.key,
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
