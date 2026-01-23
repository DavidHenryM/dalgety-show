"use client"

import { authClient } from "./auth-client";

export async function signIn(email: string, callbackURL?: string): Promise<{data: unknown, error: unknown}> {
  const { data, error } = await authClient.signIn.magicLink({
    email: email,
    callbackURL: callbackURL ?? "/home",
    errorCallbackURL: "/signin-error",
  })
  return {data, error}
}

export async function signOut(): Promise<{data: unknown, error: unknown}> {
  const { data, error } = await authClient.signOut()
  return {data, error}
}