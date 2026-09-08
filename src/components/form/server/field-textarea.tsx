import { useFormStatus } from "react-dom";
import type { FormState } from "~/hooks/use-form-action-state";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "~/components/ui/input-group";
import { cn } from "~/utils";
import { useState } from "react";
import { useTranslations } from "next-intl";

type FieldInputProps<TValue> = {
  formState: FormState<TValue>;
  name: keyof TValue;
  label: React.ReactNode;
  description?: React.ReactNode;
  lengthCounter?: number;
} & React.ComponentProps<"textarea">;

export function FieldTextarea<TValue>({
  formState,
  name,
  label,
  description,
  className,
  lengthCounter,
  ...p
}: FieldInputProps<TValue>) {
  const isInvalid = !!formState.errors?.[name]?.length;

  const defaultValue = formState.values?.[name] as any;

  const [value, setValue] = useState<string>(defaultValue);

  const t = useTranslations("Common.components.textare");

  const { pending } = useFormStatus();

  return (
    <Field data-invalid={isInvalid} data-disabled={pending}>
      <FieldContent>
        <FieldLabel htmlFor={`form-input-${name}`}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <InputGroup>
        <InputGroupTextarea
          id={`form-input-${name}`}
          name={name}
          value={value}
          onChange={({ target }) => setValue(target.value)}
          rows={6}
          className={cn("min-h-24 resize-none", className)}
          aria-invalid={isInvalid}
          {...p}
        />
        {lengthCounter && (
          <InputGroupAddon align="block-end">
            <InputGroupText className="tabular-nums">
              {t("counter", {
                current: value?.length ?? 0,
                lengthCounter,
              })}
            </InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
      {formState.errors?.[name] && (
        <FieldError>{formState.errors[name][0]}</FieldError>
      )}
    </Field>
  );
}
