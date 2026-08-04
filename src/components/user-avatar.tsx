"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { Session } from "next-auth";
import ConditionGuard from "~/components/condition-guard";
import { UserRound } from "lucide-react";
import { cn } from "~/utils";

type SessionUser = NonNullable<Session["user"]>;

type UserAvatarProps = Pick<SessionUser, "image" | "name"> & {
  className?: string;
};

export default function UserAvatar({
  image,
  name,
  className,
}: UserAvatarProps) {
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarImage src={image!} alt={name ?? ""} />
      <AvatarFallback>
        <ConditionGuard condition={!!name} fallback={<UserRound />}>
          {name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </ConditionGuard>
      </AvatarFallback>
    </Avatar>
  );
}
