import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { FormControlFunc } from "~/components/form/client/types";
import { FormBase } from "~/components/form/client/form-base";
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

type FormInputCustomProps = {
  currency?: keyof typeof CURRENCY_SYMBOLS;
};

type InputProps = React.ComponentProps<"input">;

export const FormInput: FormControlFunc<InputProps & FormInputCustomProps> = ({
  control,
  label,
  name,
  description,
  ...inputProps
}) => {
  const controllerProps = { control, label, name, description };
  return (
    <FormBase
      {...controllerProps}
      render={({ field, fieldState, label, description }) => {
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
            </FieldContent>
            <InputGrouped
              id={field.name}
              aria-invalid={fieldState.invalid}
              {...field}
              {...inputProps}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

type InputGroupedProps = Pick<FormInputCustomProps, "currency"> &
  React.ComponentProps<"input">;

function InputGrouped({ currency, ...p }: InputGroupedProps) {
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
