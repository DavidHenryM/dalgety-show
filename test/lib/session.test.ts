import { describe, expect, it, vi } from "vitest";
import { signIn, signInWithOtp, signOut } from "@app/lib/session";

const magicLink = vi.hoisted(() => vi.fn());
const signOutFn = vi.hoisted(() => vi.fn());
const sendVerificationOtp = vi.hoisted(() => vi.fn());
const emailOtpSignIn = vi.hoisted(() => vi.fn());

vi.mock("@lib/auth-client", () => ({
  authClient: {
    signIn: {
      magicLink,
      emailOtp: emailOtpSignIn
    },
    emailOtp: {
      sendVerificationOtp
    },
    signOut: signOutFn
  }
}));

describe("session", () => {
  it("signIn forwards to auth client", async () => {
    magicLink.mockResolvedValue({ data: { ok: true }, error: null });
    sendVerificationOtp.mockResolvedValue({ data: { ok: true }, error: null });
    const result = await signIn("a@example.com");
    expect(magicLink).toHaveBeenCalled();
    expect(sendVerificationOtp).toHaveBeenCalled();
    expect(result.data).toEqual({ ok: true });
  });

  it("signOut forwards to auth client", async () => {
    signOutFn.mockResolvedValue({ data: { ok: true }, error: null });
    const result = await signOut();
    expect(signOutFn).toHaveBeenCalled();
    expect(result.data).toEqual({ ok: true });
  });

  it("signInWithOtp forwards to auth client", async () => {
    emailOtpSignIn.mockResolvedValue({ data: { ok: true }, error: null });
    const result = await signInWithOtp("a@example.com", "123456");
    expect(emailOtpSignIn).toHaveBeenCalled();
    expect(result.data).toEqual({ ok: true });
  });
});
