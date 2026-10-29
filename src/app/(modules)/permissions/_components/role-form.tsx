"use client";

import { useTransition, type Dispatch } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/libs/trpc/react";
import {
  createRoleSchema,
  type RoleInput,
} from "~/libs/db/schemas/permissions";
import {
  Form,
  FormInput,
  FormMultiSelect,
  FormSelect,
  FormTextarea,
} from "~/components/form/client";
import { LoadingButton } from "~/components/ui/button";

import { updateAction } from "../_actions/update-action";
import { newAction } from "../_actions/new-action";

type Role = {
  id: number;
  storeId: unknown;
  name: string;
  description: string;
  permissions: string[];
};

type RoleFormProps = {
  setOpen: Dispatch<boolean>;
  role?: Role;
};

export function RoleForm({ setOpen, role }: RoleFormProps) {
  const t = useTranslations("PermissionsPage.roles.form");

  const form = useForm({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: role?.name ?? "",
      storeId: role?.storeId?.toString() ?? null,
      description: role?.description ?? "",
      permissions: role?.permissions ?? [],
    },
  });

  const [isPendingSave, startSaveTransition] = useTransition();

  const utils = api.useUtils();

  function onSubmit(data: RoleInput) {
    startSaveTransition(async () => {
      if (role) {
        const updatedRole = await updateAction(role.id, data);

        utils.permission.allRoles.setData(undefined, (old = []) =>
          old.map((item) =>
            item.id === updatedRole.id
              ? { ...updatedRole, storeId: 0, storeName: "", storeSlug: "" }
              : item,
          ),
        );
      } else {
        const newRole = await newAction(data);

        utils.permission.allRoles.setData(undefined, (old = []) => [
          ...old,
          { ...newRole, storeId: 0, storeName: "", storeSlug: "" },
        ]);
      }

      await utils.permission.allRoles.invalidate();

      setOpen(false);
    });
  }

  const { data: permissions = [], isPending: isPendingPermissions } =
    api.permission.all.useQuery();

  const permissionOptions = permissions.map((p) => ({
    value: p.id.toString(),
    label: p.key,
  }));

  const { data: stores = [], isPending: isPendingStores } =
    api.store.all.useQuery();

  const storeOptions = stores.map((p) => ({
    value: p.id.toString(),
    label: p.name,
  }));

  return (
    <Form
      form={form}
      onValid={onSubmit}
      onInvalid={(errors, _event) => console.warn("onInvalid: ", errors)}
    >
      <FormInput
        control={form.control}
        name="name"
        label={t("fields.name.label")}
        description={t("fields.name.description")}
        placeholder={t("fields.name.placeholder")}
        autoComplete="off"
      />

      <FormSelect
        control={form.control}
        name="storeId"
        label={t("fields.storeId.label")}
        description={t("fields.storeId.description")}
        options={storeOptions}
        isLoading={isPendingStores}
      />

      <FormTextarea
        control={form.control}
        name="description"
        label={t("fields.description.label")}
        description={t("fields.description.description")}
        placeholder={t("fields.description.placeholder")}
        maxLength={255}
        rows={3}
      />

      <FormMultiSelect
        control={form.control}
        name="permissions"
        label={t("fields.permissions.label")}
        options={permissionOptions}
        isLoading={isPendingPermissions}
      />

      <div>
        <LoadingButton type="submit" isLoading={isPendingSave}>
          {t("submit")}
        </LoadingButton>
      </div>
    </Form>
  );
}
