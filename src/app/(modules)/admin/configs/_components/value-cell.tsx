"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useTransition, type FocusEventHandler } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { updateAction } from "../_actions/update-action";

type ValueCellProps = {
  codeId: string;
  value: string;
};

export function ValueCell({ codeId, value }: ValueCellProps) {
  const [isSaving, startTransition] = useTransition();

  const handleBlur: FocusEventHandler<HTMLInputElement> = ({ target }) => {
    startTransition(async () => {
      await updateAction(codeId, target.value);
    });
  };

  return (
    <InputGroup>
      <InputGroupInput onBlur={handleBlur} defaultValue={value} />
      <InputGroupAddon align="inline-end">
        {isSaving && <LoaderCircleIcon className="animate-spin" />}
      </InputGroupAddon>
    </InputGroup>
  );
}
