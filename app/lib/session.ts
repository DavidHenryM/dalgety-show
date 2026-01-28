"use client"

import { BetterAuthError, BetterAuthSignInData, BetterAuthSignOutData,  } from "../types";
import { authClient } from "./auth-client";

export async function signIn(email: string, callbackURL?: string): Promise<{data: BetterAuthSignInData, error: BetterAuthError}> {
  const { data, error } = await authClient.signIn.magicLink({
    email: email,
    callbackURL: callbackURL ?? "/home",
    errorCallbackURL: "/signin-error",
  })
  return {data, error}
}

export async function signOut(): Promise<{data: BetterAuthSignOutData, error: BetterAuthError}> {
  const { data, error } = await authClient.signOut()
  return {data, error}
}