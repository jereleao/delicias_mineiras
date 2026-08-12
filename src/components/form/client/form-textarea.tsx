import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Textarea } from "~/components/ui/textarea";
import type { FormControlFunc } from "~/components/form/client/types";
import { FormBase } from "~/components/form/client/form-base";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "~/components/ui/input-group";
import ConditionGuard from "~/components/condition-guard";
import { useTranslations } from "next-intl";

type TextareaProps = React.ComponentProps<"textarea">;

type TextareaCustomProps = {
  lengthCounter?: number;
};

export const FormTextarea: FormControlFunc<
  TextareaProps & TextareaCustomProps
> = ({ control, label, name, description, lengthCounter, ...inputProps }) => {
  const controllerProps = { control, label, name, description };

  const t = useTranslations("Common");

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
            <InputGroup>
              <InputGroupTextarea
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...field}
                {...inputProps}
              />
              <ConditionGuard condition={!!lengthCounter}>
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {`${field.value?.length ?? 0}/${lengthCounter} ${t("chars")}`}
                  </InputGroupText>
                </InputGroupAddon>
              </ConditionGuard>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
