import { Controller, type FieldPath, type FieldValues } from "react-hook-form";
import type { FormBaseProps } from "./types";

export function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  render,
  control,
  name,
  ...r
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={(p) => render({ ...p, ...r })}
    />
  );
}
