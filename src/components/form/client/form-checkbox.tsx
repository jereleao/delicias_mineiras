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

type FormCheckboxProps = {
  inline?: boolean;
  classNames?: {
    container?: string;
    checkbox?: string;
  };
};

export const FormCheckbox: FormControlFunc<FormCheckboxProps> = (props) => {
  const { classNames } = props;

  const { container: containerClassName, checkbox: checkboxClassName } =
    classNames || {};

  if (props.inline)
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
            <Field
              data-invalid={fieldState.invalid}
              orientation="horizontal"
              className={containerClassName}
            >
              <Checkbox
                {...field}
                checked={value}
                onCheckedChange={onChange}
                className={checkboxClassName}
              />
              <FieldContent>
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                {description && (
                  <FieldDescription>{description}</FieldDescription>
                )}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          );
        }}
      />
    );

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
          <Field
            data-invalid={fieldState.invalid}
            className={containerClassName}
          >
            <FieldContent>
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
            </FieldContent>
            <Checkbox
              {...field}
              checked={value}
              onCheckedChange={onChange}
              className={checkboxClassName}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
