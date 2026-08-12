"use client";

import { use } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type {
  FormControlFunc,
  SelectOption,
} from "~/components/form/client/types";
import { FormBase } from "~/components/form/client/form-base";

type OptionGetter = () => Promise<Array<SelectOption>>;

export const FormSelect: FormControlFunc<{
  options: Array<SelectOption> | OptionGetter;
}> = (props) => {
  let resolvedOptions: Array<SelectOption> = [];

  if (typeof props.options == "function") {
    resolvedOptions = use(props.options());
  } else if (Array.isArray(props.options)) {
    resolvedOptions = props.options;
  }

  return (
    <FormBase
      {...props}
      render={({ field, fieldState, label, description }) => {
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
            </FieldContent>
            <Select {...field} onValueChange={field.onChange}>
              <SelectTrigger
                aria-invalid={fieldState.invalid}
                id={field.name}
                onBlur={field.onBlur}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {resolvedOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
