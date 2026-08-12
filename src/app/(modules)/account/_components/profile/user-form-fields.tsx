"use client";

import * as React from "react";
import { type SubmitHandler, type UseFormReturn } from "react-hook-form";
import { FieldDescription, FieldSet } from "~/components/ui/field";
import { Form, FormInput, FormTextarea } from "~/components/form/client";
import { LoadingButton } from "~/components/ui/button";
import type { UserInfoType } from "./user-profile-edit";

type UserFormFieldsProps = {
  form: UseFormReturn<UserInfoType>;
  isPending: boolean;
  onSubmit: SubmitHandler<UserInfoType>;
};

export function UserFormFields({
  form,
  isPending,
  onSubmit,
}: UserFormFieldsProps) {
  return (
    <FieldSet className="w-full max-w-lg pt-2">
      <FieldDescription className="h-5">
        Edit your profile information.
      </FieldDescription>

      <Form form={form} onValid={onSubmit}>
        <FormInput control={form.control} name="name" label="Display Name" />

        <FormTextarea control={form.control} name="bio" label="Bio" />

        <div>
          <LoadingButton type="submit" isLoading={isPending}>
            Submit
          </LoadingButton>
        </div>
      </Form>
    </FieldSet>
  );
}
