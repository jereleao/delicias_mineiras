"use server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { env, PASSKEY_PROVIDER_ID } from "~/env";
import { signIn, signOut } from "~/libs/auth";
import { db } from "~/libs/db";
import { storedCredentials } from "~/libs/db/schema";
import { getNow } from "~/utils";
import { eq } from "drizzle-orm";
import { rpId } from "~/libs/auth/config";

export async function logoutAction() {
  await signOut();
}

export async function loginWithPasskey(
  claimedCred: AuthenticationResponseJSON,
) {
  const expectedChallenge = env.WEB_AUTHN_CHALLENGE;
  const expectedOrigin = env.NEXT_PUBLIC_BASE_URL;
  const expectedRPID = rpId;

  const rawId = isoBase64URL.toBuffer(claimedCred.id);

  const storedCred = await db.query.storedCredentials.findFirst({
    where: (key, { eq }) => eq(key.credentialID, rawId),
  });

  if (!storedCred) {
    throw new Error("Authenticating credential not found.");
  }

  const credentialPublicKey = isoBase64URL.toBuffer(
    storedCred.credentialPublicKey,
  );
  const { counter, transports: storedTransports } = storedCred;

  const transports = storedTransports?.split(",") as AuthenticatorTransport[];

  const authenticator = {
    credentialPublicKey,
    credentialID: storedCred.credentialID,
    counter,
    transports,
  };

  const verification = await verifyAuthenticationResponse({
    response: claimedCred as any,
    expectedChallenge,
    expectedOrigin,
    expectedRPID,
    authenticator,
    // Since this is testing the client, verifying the UV flag here doesn't matter.
    requireUserVerification: false,
  });

  const { verified, authenticationInfo } = verification;

  if (!verified) {
    throw new Error("User verification failed.");
  }

  await db
    .update(storedCredentials)
    .set({
      counter: authenticationInfo.newCounter,
      lastUsed: getNow(),
    })
    .where(eq(storedCredentials.credentialID, rawId));

  await signIn(PASSKEY_PROVIDER_ID, {
    userId: storedCred.userId,
    redirect: false,
  });
}
