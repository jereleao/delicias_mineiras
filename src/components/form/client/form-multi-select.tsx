"use client";

import { use } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type {
  FormControlFunc,
  SelectOption,
} from "~/components/form/client/types";
import { FormBase } from "~/components/form/client/form-base";
import { LoaderCircleIcon } from "lucide-react";

type OptionGetter = () => Promise<Array<SelectOption>>;

export const FormMultiSelect: FormControlFunc<{
  options: Array<SelectOption> | OptionGetter;
  isLoading?: boolean;
  placeholder?: string;
}> = (props) => {
  let resolvedOptions: Array<SelectOption> = [];

  if (typeof props.options === "function") {
    resolvedOptions = use(props.options());
  } else if (Array.isArray(props.options)) {
    resolvedOptions = props.options;
  }

  return (
    <FormBase
      {...props}
      render={({ field, fieldState, label, description }) => {
        const selectedValues = Array.isArray(field.value)
          ? field.value.filter(
              (value: any): value is string => typeof value === "string",
            )
          : [];
        const selectedLabels = resolvedOptions
          .filter((option) => selectedValues.includes(option.value))
          .map((option) => option.label);

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>
                {label}
                {props.isLoading && (
                  <LoaderCircleIcon className="animate-spin" />
                )}
              </FieldLabel>
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
            </FieldContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  ref={field.ref}
                  id={field.name}
                  name={field.name}
                  type="button"
                  variant="outline"
                  className="w-full justify-between font-normal"
                  disabled={field.disabled}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.error ? `${field.name}-error` : undefined
                  }
                  onBlur={field.onBlur}
                >
                  <span className="truncate">
                    {selectedLabels.length > 0
                      ? selectedLabels.join(", ")
                      : props.placeholder}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {resolvedOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={selectedValues.includes(option.value)}
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={(checked) => {
                      const nextValues = checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter(
                            (value: any) => value !== option.value,
                          );

                      field.onChange(nextValues);
                    }}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {fieldState.invalid && (
              <FieldError
                id={`${field.name}-error`}
                errors={[fieldState.error]}
              />
            )}
          </Field>
        );
      }}
    />
  );
};
