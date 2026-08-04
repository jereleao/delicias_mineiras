import { isoBase64URL } from "@simplewebauthn/server/helpers";
import {
  MonitorSmartphone,
  Smartphone,
  Usb,
  Nfc,
  Bluetooth,
  Waypoints,
  Trash2,
  LaptopMinimal,
  LoaderCircle,
} from "lucide-react";
import { useLocale } from "next-intl";
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
type AuthenticatorAttachment = "platform" | "cross-platform";
type CredentialDeviceType = "singleDevice" | "multiDevice";

const ALL_TRANSPORTS: Array<{
  key: Transport;
  label: string;
  icon: typeof MonitorSmartphone;
}> = [
  { key: "internal", label: "Internal", icon: MonitorSmartphone },
  { key: "hybrid", label: "Hybrid", icon: Waypoints },
  { key: "usb", label: "USB", icon: Usb },
  { key: "nfc", label: "NFC", icon: Nfc },
  { key: "ble", label: "Bluetooth", icon: Bluetooth },
];

const ALL_AUTH_ATTACHMENTS: Array<{
  key: AuthenticatorAttachment;
  label: string;
}> = [
  { key: "platform", label: "Plataform Authenticator" },
  { key: "cross-platform", label: "Cross Plataform Authenticator" },
];

const ALL_DEVICE_TYPES: Array<{
  key: CredentialDeviceType;
  label: string;
}> = [
  { key: "singleDevice", label: "Single Device" },
  { key: "multiDevice", label: "Multi Device" },
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
            <LaptopMinimal className="size-4" />
          )}
          {credential.platform == "mobile" && <Smartphone className="size-4" />}
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
              <LoaderCircle className="animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <DetailRow
          label="Authenticator Type"
          value={
            ALL_AUTH_ATTACHMENTS.find(
              (d) => d.key == credential.authenticatorAttachment,
            )?.label ?? ""
          }
        />
        <DetailRow
          label="Credential Type"
          value={
            ALL_DEVICE_TYPES.find(
              (d) => d.key == credential.credentialDeviceType,
            )?.label ?? ""
          }
        />
        <div>
          <dt className="text-foreground h-5 text-[15px]">Transports</dt>
          <dd className="flex flex-wrap gap-3">
            {ALL_TRANSPORTS.filter((t) =>
              credential.transports?.split(",").includes(t.key),
            ).map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.key}
                  className="flex items-center gap-1.5"
                  title={t.label}
                >
                  <Icon
                    className="text-muted-foreground h-5 w-5"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{t.label} suportado</span>
                </div>
              );
            })}
          </dd>
        </div>
        <DetailRow label="Created At" value={createdAt} />
        <DetailRow label="Last Used" value={lastUsed} />
      </CardContent>
    </Card>
  );
}
