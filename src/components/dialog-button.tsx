"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { cn } from "~/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";

interface IDialogButtonProps<T = { setOpen: Dispatch<SetStateAction<boolean>> }>
  extends React.PropsWithChildren {
  content: React.FC<T> | React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function DialogButton<T>({
  content: ContentComponent,
  title,
  description,
  children,
  className,
  ...props
}: IDialogButtonProps<T> & Omit<T, "setOpen">) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn("sm:max-w-110", className)}
        onPointerDownOutside={(e) => {
          console.debug(
            "TODO conflict with Select component that closes the dialog",
          );
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {!!description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-3">
          {typeof ContentComponent == "function" ? (
            <ContentComponent setOpen={setOpen} {...(props as T)} />
          ) : (
            ContentComponent
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
