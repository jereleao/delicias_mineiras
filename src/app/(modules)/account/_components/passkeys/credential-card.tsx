"use client";

import { isoBase64URL } from "@simplewebauthn/server/helpers";
import {
  MonitorSmartphoneIcon,
  SmartphoneIcon,
  UsbIcon,
  NfcIcon,
  BluetoothIcon,
  WaypointsIcon,
  Trash2Icon,
  LaptopMinimalIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { AppleIcon, Windows10Icon } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { dateOptionsWithTime } from "~/libs/i18n/locale-options";
import type { ExistingKey } from "~/libs/api/routers/user";
import { api } from "~/libs/trpc/react";
import { DetailRow } from "./detail-row";

type CredentialCardProps = {
  credential: ExistingKey;
};

type Transport = "internal" | "hybrid" | "usb" | "nfc" | "ble";
// type AuthenticatorAttachment = "platform" | "cross-platform";
// type CredentialDeviceType = "singleDevice" | "multiDevice";

const ALL_TRANSPORTS: Array<{
  key: Transport;
  icon: typeof MonitorSmartphoneIcon;
}> = [
  {
    key: "internal",
    icon: MonitorSmartphoneIcon,
  },
  { key: "hybrid", icon: WaypointsIcon },
  { key: "usb", icon: UsbIcon },
  { key: "nfc", icon: NfcIcon },
  { key: "ble", icon: BluetoothIcon },
];

const appleOSRegex = /\b(?:iOS|iPadOS|macOS|tvOS|watchOS|visionOS)\b/;
const windowsRegex = /\bWindows\b/;

export function CredentialCard({ credential }: CredentialCardProps) {
  const isApple = appleOSRegex.test(credential.os || "");
  const isWindows = windowsRegex.test(credential.os || "");

  const locale = useLocale();

  const createdAt = useMemo(() => {
    if (!credential.createdAt) return "";
    return new Date(credential.createdAt).toLocaleDateString(
      locale,
      dateOptionsWithTime,
    );
  }, [locale, credential.createdAt]);

  const lastUsed = useMemo(() => {
    if (!credential.lastUsed) return "";
    return new Date(credential.lastUsed).toLocaleDateString(
      locale,
      dateOptionsWithTime,
    );
  }, [locale, credential.lastUsed]);

  const utils = api.useUtils();

  const { mutate: deleteCredential, isPending: isDeleting } =
    api.webauthn.deleteCredential.useMutation({
      async onSuccess() {
        await utils.user.existingKeys.invalidate();
      },
    });

  const handleDeleteClick = () => {
    console.debug("TODO: Add confirmation alert");
    deleteCredential({
      id: isoBase64URL.fromBuffer(credential.credentialID),
    });
  };

  const t = useTranslations("AccountPage.passkeys");

  return (
    <Card className="max-w-1/2 min-w-[32%]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isApple && <AppleIcon />}
          {isWindows && <Windows10Icon />}
          <p>{credential.browser}</p>
        </CardTitle>
        <CardDescription className="flex items-center justify-end gap-2">
          {credential.platform == "desktop" && (
            <LaptopMinimalIcon className="size-4" />
          )}
          {credential.platform == "mobile" && (
            <SmartphoneIcon className="size-4" />
          )}
          <p>{credential.os}</p>
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDeleteClick}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <Trash2Icon className="size-4" />
            )}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <DetailRow
          label={t("details.authenticatorType")}
          value={t("authenticatorTypeOptions", {
            type: credential.authenticatorAttachment,
          })}
        />
        <DetailRow
          label={t("details.credentialType")}
          value={t("credentialTypeOptions", {
            type: credential.credentialDeviceType,
          })}
        />
        <div>
          <dt className="text-foreground h-5 text-[15px]">
            {t("details.transports")}
          </dt>
          <dd className="flex flex-wrap gap-3">
            {ALL_TRANSPORTS.filter((t) =>
              credential.transports?.split(",").includes(t.key),
            ).map((transport) => {
              const Icon = transport.icon;
              return (
                <div
                  key={transport.key}
                  className="flex items-center gap-1.5"
                  title={t(`transportOptions.${transport.key}`)}
                >
                  <Icon
                    className="text-muted-foreground h-5 w-5"
                    aria-hidden="true"
                  />
                  <span className="sr-only">
                    {t(`transportOptions.${transport.key}`)}
                  </span>
                </div>
              );
            })}
          </dd>
        </div>
        <DetailRow label={t("details.createdAt")} value={createdAt} />
        <DetailRow label={t("details.lastUsed")} value={lastUsed} />
      </CardContent>
    </Card>
  );
}
