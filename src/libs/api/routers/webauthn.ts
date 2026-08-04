import { z } from "zod";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { env } from "~/env";
import { storedCredentials } from "~/libs/db/schema";
import { rpId } from "~/libs/auth/config";
import { getNow } from "~/utils";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/libs/api/trpc";

export const webauthnRouter = createTRPCRouter({
  makeCredentialOptions: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;

    const user = {
      id: userId,
      name: ctx.session?.user.email || "",
      displayName: ctx.session?.user.name || ctx.session?.user.email || "",
    };

    const existingKeys = await ctx.db.query.storedCredentials.findMany({
      where: (key, { eq }) => eq(key.userId, userId),
    });

    const excludeCredentials: PublicKeyCredentialDescriptorJSON[] =
      existingKeys.map((key) => ({
        id: isoBase64URL.fromBuffer(key.credentialID),
        type: "public-key",
        transports: key.transports?.split(",") as AuthenticatorTransport[],
      }));

    const publicKey: PublicKeyCredentialCreationOptionsJSON = {
      user,
      rp: {
        name: env.APPLICATION_NAME,
        id: rpId,
      },
      challenge: env.WEB_AUTHN_CHALLENGE,
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      timeout: 60000,
      authenticatorSelection: { authenticatorAttachment: "platform" },
      attestation: "direct",
      excludeCredentials,
    };

    return {
      publicKey,
    };
  }),

  makeCredential: protectedProcedure
    .input(
      z.object({
        authenticatorAttachment: z.enum(["platform", "cross-platform"]),
        clientExtensionResults: z.object({}), // AuthenticationExtensionsClientOutputsJSON
        id: z.string().min(1),
        rawId: z.string().min(1),

        response: z.object({
          attestationObject: z.string().min(1),
          authenticatorData: z.string().optional(),
          clientDataJSON: z.string().min(1),
          publicKey: z.string().min(1),
          publicKeyAlgorithm: z.number(),
          transports: z
            .array(
              z.enum([
                "ble",
                "cable",
                "hybrid",
                "internal",
                "nfc",
                "smart-card",
                "usb",
              ]),
            )
            .optional(),
        }),
        type: z.literal("public-key"),
        useragent: z.object({
          browser: z.string().optional(),
          os: z.string().optional(),
          platform: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input: credential }) => {
      const userId = ctx.session?.user.id;

      if (!userId) throw new Error("Unauthorized");

      const expectedOrigin = env.NEXT_PUBLIC_BASE_URL;
      const expectedChallenge = env.WEB_AUTHN_CHALLENGE;

      const verification = await verifyRegistrationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin,
        // Since this is testing the client, verifying the UV flag here doesn't matter.
        requireUserVerification: false,
      });

      const { verified, registrationInfo } = verification;

      if (!verified || !registrationInfo) {
        throw new Error("User verification failed.");
      }

      const {
        credentialPublicKey,
        credentialID,
        counter,
        credentialDeviceType,
        credentialBackedUp,
      } = registrationInfo;

      const base64PublicKey = isoBase64URL.fromBuffer(credentialPublicKey);
      const { authenticatorAttachment, response } = credential;
      const transports = response.transports || [];

      const newCredential = {
        credentialID,
        userId,
        credentialPublicKey: base64PublicKey,
        counter,
        credentialDeviceType,
        credentialBackedUp,
        transports: transports.join(",") ?? null,
        authenticatorAttachment,
        browser: credential.useragent?.browser,
        os: credential.useragent?.os,
        platform: credential.useragent?.platform,
        createdAt: getNow(),
      };

      await ctx.db.insert(storedCredentials).values(newCredential);
    }),

  makeAssertionOptions: publicProcedure.query(() => {
    const publicKey: PublicKeyCredentialRequestOptionsJSON = {
      challenge: env.WEB_AUTHN_CHALLENGE,
      rpId,
      userVerification: "preferred",
    };

    return {
      mediation: "conditional",
      publicKey,
    };
  }),

  deleteCredential: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      if (!userId) throw new Error("Unauthorized");

      const rawId = isoBase64URL.toBuffer(input.id);

      const storedCred = await ctx.db.query.storedCredentials.findFirst({
        where: (key, { eq }) => eq(key.credentialID, rawId),
      });

      if (!storedCred) throw new Error("Not found");

      if (storedCred.userId !== userId) throw new Error("Unauthorized");

      await ctx.db
        .delete(storedCredentials)
        .where(eq(storedCredentials.credentialID, rawId));
    }),
});
