import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Checkbox } from "~/components/ui/checkbox";
import type { FormControlFunc } from "~/components/form/client/types";
import { FormBase } from "~/components/form/client/form-base";

export const FormCheckbox: FormControlFunc = (props) => {
  return (
    <FormBase
      {...props}
      render={({
        field: { onChange, value, ...field },
        fieldState,
        label,
        description,
      }) => {
        return (
          <Field data-invalid={fieldState.invalid} orientation="horizontal">
            <Checkbox {...field} checked={value} onCheckedChange={onChange} />
            <FieldContent>
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        );
      }}
    />
  );
};
