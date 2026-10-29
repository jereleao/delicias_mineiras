"use client";

import { Form, FormInput } from "~/components/form/client";
import { Checkbox } from "~/components/ui/checkbox";
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

  // TODO: Check the default role option
  // const defaultRoleId = roleOptions.find((opt) => opt.name == "user")?.id;

  const form = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      roleIds: /*defaultRoleId ? [defaultRoleId] :*/ [],
    },
  });
  const selectedRoleIds = form.watch("roleIds");

  const [isPendingSave, startSaveTransition] = useTransition();

  const utils = api.useUtils();

  function onSubmit(data: InviteType) {
    startSaveTransition(async () => {
      const newUser = await newAction(data);

      if (newUser)
        utils.user.allStore.setData(undefined, (old = []) => [...old, newUser]);

      await utils.user.allStore.invalidate();
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

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          {t("form.fields.role.label")}
        </legend>
        {roleOptions.map(({ id, key, description }) => (
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
              {key}
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
