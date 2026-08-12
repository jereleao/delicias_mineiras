"use client";

import type z from "zod";
import { useActionState } from "react";

export type FormState<T> = {
  values?: T;
  errors: null | Partial<Record<keyof T, string[]>>;
  success: boolean;
};

export function actionValidator<
  TSchema extends z.ZodType,
  TValue = z.infer<TSchema>,
>(
  schema: TSchema,
  action: (
    validatedData: z.infer<TSchema>,
  ) => void | FormState<TValue> | Promise<FormState<TValue> | void>,
) {
  const actionHandler = async (
    _prevState: FormState<TValue>,
    formData: FormData,
  ): Promise<FormState<TValue>> => {
    const rawData = Object.fromEntries(formData.entries());
    const validated = schema.safeParse(rawData);

    if (!validated.success) {
      return {
        values: rawData as TValue,
        success: false,
        errors: validated.error.flatten().fieldErrors as Partial<
          Record<keyof TValue, string[]>
        >,
      };
    }

    const validatedData = validated.data;

    const actionResult = await action(validatedData);

    let result: FormState<TValue> = {
      errors: null,
      success: true,
    };

    if (actionResult) result = Object.assign(result, actionResult);

    return result;
  };

  return actionHandler;
}

export function useFormActionState<
  TSchema extends z.ZodType,
  TValue = z.infer<TSchema>,
>(
  schema: TSchema,
  action: (
    validatedData: z.infer<TSchema>,
  ) => void | FormState<TValue> | Promise<FormState<TValue> | void>,
  initialState: FormState<TValue> = {
    errors: null,
    success: false,
  },
): [
  state: FormState<TValue>,
  dispatch: (payload: FormData) => void,
  isPending: boolean,
] {
  const actionHandler = actionValidator(schema, action);

  const [formState, formAction, pending] = useActionState(
    actionHandler,
    initialState,
  );

  return [formState, formAction, pending];
}
