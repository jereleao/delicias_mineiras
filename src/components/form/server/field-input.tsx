import { useFormStatus } from "react-dom";
import type { FormState } from "~/hooks/use-form-action-state";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "~/components/ui/input-group";

const CURRENCY_SYMBOLS = {
  USD: "$",
  BRL: "R$",
};

type FieldInputCustomProps<TValue> = {
  formState: FormState<TValue>;
  name: keyof TValue;
  label: React.ReactNode;
  description?: React.ReactNode;
  currency?: keyof typeof CURRENCY_SYMBOLS;
};

type FieldInputProps<TValue> = FieldInputCustomProps<TValue> &
  React.ComponentProps<"input">;

export function FieldInput<TValue>({
  formState,
  name,
  label,
  description,
  ...p
}: FieldInputProps<TValue>) {
  const isInvalid = !!formState.errors?.[name]?.length;

  const defaultValue = formState.values?.[name] as any;

  const { pending } = useFormStatus();

  return (
    <Field data-invalid={isInvalid} data-disabled={pending}>
      <FieldContent>
        <FieldLabel htmlFor={`form-input-${name}`}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <InputGrouped
        id={`form-input-${name}`}
        name={name}
        defaultValue={defaultValue}
        disabled={pending}
        aria-invalid={isInvalid}
        {...p}
      />
      {formState.errors?.[name] && (
        <FieldError>{formState.errors[name][0]}</FieldError>
      )}
    </Field>
  );
}

type InputGroupedProps<TValue> = Pick<
  FieldInputCustomProps<TValue>,
  "currency"
> &
  React.ComponentProps<"input">;

function InputGrouped<TValue>({ currency, ...p }: InputGroupedProps<TValue>) {
  if (!currency) {
    return <Input {...p} />;
  }

  const currencySymbol = CURRENCY_SYMBOLS[currency];

  return (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>{currencySymbol}</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput {...p} />
      <InputGroupAddon align="inline-end">
        <InputGroupText>{currency}</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}
