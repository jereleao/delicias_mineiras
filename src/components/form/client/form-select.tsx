"use client";

import { use, useState } from "react";
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
import { LoaderCircleIcon, XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTranslations } from "next-intl";

type OptionGetter = () => Promise<Array<SelectOption>>;

export const FormSelect: FormControlFunc<{
  options: Array<SelectOption> | OptionGetter;
  isLoading?: boolean;
  required?: boolean;
}> = (props) => {
  const t = useTranslations("Common");
  let resolvedOptions: Array<SelectOption> = [];

  if (typeof props.options == "function") {
    resolvedOptions = use(props.options());
  } else if (Array.isArray(props.options)) {
    resolvedOptions = props.options;
  }

  const [open, setOpen] = useState(false);

  return (
    <FormBase
      {...props}
      render={({ field, fieldState, label, description }) => {
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
            <div className="flex items-center gap-1">
              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                name={field.name}
                required={props.required}
                disabled={field.disabled}
                open={open}
                onOpenChange={setOpen}
              >
                <SelectTrigger
                  ref={field.ref}
                  aria-invalid={fieldState.invalid}
                  id={field.name}
                  className="flex-1"
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
                  {!props.required &&
                    field.value != null &&
                    field.value !== "" && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground h-auto w-full justify-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-normal"
                        aria-label={t("clearSelection")}
                        onClick={() => {
                          field.onChange(null);
                          setOpen(false);
                        }}
                      >
                        {t("clearSelection")}
                        <XIcon />
                      </Button>
                    )}
                </SelectContent>
              </Select>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
