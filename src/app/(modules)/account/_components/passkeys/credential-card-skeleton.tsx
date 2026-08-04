import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { DetailRow } from "./detail-row";

export function CredentialCardSkeleton() {
  return (
    <Card className="max-w-1/2 min-w-[32%]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5.5 w-24" />
        </CardTitle>
        <CardDescription className="flex items-center justify-end gap-2">
          <Skeleton className="h-5 w-24" />
        </CardDescription>
        <CardAction>
          <Skeleton className="size-7" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <DetailRow
          label={<Skeleton className="h-4 w-30" />}
          value={<Skeleton className="h-4 w-24" />}
        />
        <DetailRow
          label={<Skeleton className="h-4 w-30" />}
          value={<Skeleton className="h-4 w-24" />}
        />
        <div>
          <dt className="text-foreground h-5 text-[15px]">
            <Skeleton className="h-4 w-30" />
          </dt>
          <dd className="flex flex-wrap gap-3">
            <Skeleton className="size-5" />
          </dd>
        </div>
        <DetailRow
          label={<Skeleton className="h-4 w-30" />}
          value={<Skeleton className="h-4 w-24" />}
        />
        <DetailRow
          label={<Skeleton className="h-4 w-30" />}
          value={<Skeleton className="h-4 w-24" />}
        />
      </CardContent>
    </Card>
  );
}

export const CredentialArraySkeleton = () =>
  Array.from({ length: 2 }, (_, index) => (
    <CredentialCardSkeleton key={index} />
  ));
