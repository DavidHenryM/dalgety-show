"use client"

import { BetterAuthError, BetterAuthSignInData, BetterAuthSignInOtpData, BetterAuthSignOutData,  } from "../types";
import { authClient } from "./auth-client";

export async function signIn(email: string, callbackURL?: string): Promise<{data: BetterAuthSignInData, error: BetterAuthError}> {
  const { data, error } = await authClient.signIn.magicLink({
    email: email,
    callbackURL: callbackURL ?? "/home",
    errorCallbackURL: "/signin-error",
  })
  if (error) {
    return { data, error }
  }

  const otpResult = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "sign-in",
  })

  if (otpResult.error) {
    return { data, error: otpResult.error }
  }
  return {data, error}
}

export async function signInWithOtp(email: string, otp: string): Promise<{data: BetterAuthSignInOtpData, error: BetterAuthError}> {
  const { data, error } = await authClient.signIn.emailOtp({
    email,
    otp,
  })
  return { data, error }
}

export async function signOut(): Promise<{data: BetterAuthSignOutData, error: BetterAuthError}> {
  const { data, error } = await authClient.signOut()
  return {data, error}
}