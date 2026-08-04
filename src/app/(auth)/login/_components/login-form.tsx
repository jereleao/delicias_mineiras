"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { FingerprintPattern, LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { GoogleIcon } from "~/components/icons";
import { Input } from "~/components/ui/input";
import { Field, FieldLabel } from "~/components/ui/field";
import ConditionGuard from "~/components/condition-guard";
import { usePasskeyAvailable } from "~/hooks/use-passkey-available";
import { useWebauthnAssert } from "~/hooks/use-webauthn-assert";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const t = useTranslations("LoginPage");

  const passkeyAvailable = usePasskeyAvailable();

  const [isPending, startTransition] = useTransition();

  const [isAsserting, manuallyStartAuthentication] = useWebauthnAssert();

  const handleSendEmail = (email: string) =>
    startTransition(async () => {
      await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: "/",
      });
      setEmailSent(true);
    });

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      return;
    }

    handleSendEmail(email);
  };

  return (
    <div className="bg-background border-border w-full max-w-xl rounded-3xl border p-10 shadow-2xl">
      <h1 className="text-center text-4xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground mt-4 text-center">
        {t("description")}
      </p>

      <div className="mt-10 flex flex-col gap-4">
        <div className="flex justify-evenly">
          <Button
            variant="outline"
            className="h-10 max-w-100 rounded-full"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <GoogleIcon className="mr-2" />
            <span>{t("google")}</span>
          </Button>
          <ConditionGuard condition={passkeyAvailable}>
            <Button
              variant="outline"
              className="h-10 max-w-100 rounded-full"
              onClick={manuallyStartAuthentication}
              disabled={isAsserting}
            >
              <ConditionGuard
                condition={!isAsserting}
                fallback={<LoaderCircle className="mr-2 animate-spin" />}
              >
                <FingerprintPattern className="mr-2" />
              </ConditionGuard>
              <span>{t("passkey")}</span>
            </Button>
          </ConditionGuard>
        </div>

        <div className="border-border text-muted-foreground relative w-full border-t py-4 text-center text-sm">
          <span className="bg-background px-3">{t("or")}</span>
        </div>

        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="email">{t("email.label")}</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="py-6"
              disabled={isPending}
              required
              autoComplete="email webauthn"
            />
          </Field>
          <Button type="submit" className="py-6" disabled={isPending}>
            {isPending ? t("email.sending") : t("email.send")}
          </Button>
        </form>

        {emailSent && (
          <div className="border-border/20 bg-muted/10 text-foreground rounded-2xl border p-4 text-center text-sm">
            {t("email.sent")}
          </div>
        )}
      </div>
    </div>
  );
}
