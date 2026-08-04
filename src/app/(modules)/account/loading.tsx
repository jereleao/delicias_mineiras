import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton, skeletonClasses } from "~/components/ui/skeleton";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field";
import { cn } from "~/utils";

const FormInputSkeleton = () => {
  return (
    <Field>
      <FieldContent>
        <FieldLabel className="flex h-5 items-center">
          <Skeleton className="h-3 w-20" />
        </FieldLabel>
      </FieldContent>
      <Skeleton className="h-8 w-full min-w-0 rounded-lg" />
    </Field>
  );
};

const FormInputTextArea = () => {
  return (
    <Field>
      <FieldContent>
        <FieldLabel className="flex h-5 items-center">
          <Skeleton className="h-3 w-20" />
        </FieldLabel>
      </FieldContent>
      <Skeleton className="h-16 w-full min-w-0 rounded-lg" />
    </Field>
  );
};

export default async function LoadingAccountPage() {
  return (
    <Tabs defaultValue="loading">
      <TabsList variant="line">
        <TabsTrigger value="loading" disabled>
          <Skeleton className="h-4 w-10.25" />
        </TabsTrigger>
        <TabsTrigger value="other" disabled>
          <Skeleton className="h-4 w-15" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="loading">
        <div className="flex w-full flex-col-reverse md:flex-row">
          <FieldSet className="w-full max-w-lg pt-2">
            <FieldDescription className="flex h-5 items-center">
              <span className={cn(skeletonClasses, "h-3 w-44")} />
            </FieldDescription>
            <FieldGroup>
              <FormInputSkeleton />
              <FormInputTextArea />
              <Skeleton className="h-8 w-16.5" />
            </FieldGroup>
          </FieldSet>
          <div className="relative mx-auto flex size-24 items-center justify-center border-0">
            <Skeleton className="size-20 rounded-full" />
            <div className="absolute right-0 bottom-0 bg-transparent p-0 hover:bg-transparent">
              <Skeleton className="size-7 rounded-full" />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
