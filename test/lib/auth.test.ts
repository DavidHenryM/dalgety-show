import { describe, expect, it, vi } from "vitest";

const sendEmail = vi.fn();

vi.mock("@app/lib/brevo", () => ({ sendEmail }));

vi.mock("better-auth", () => ({
  betterAuth: vi.fn((config) => config)
}));

vi.mock("better-auth/plugins", () => ({
  emailOTP: vi.fn((config) => config),
  magicLink: vi.fn((config) => config)
}));

vi.mock("better-auth/adapters/prisma", () => ({
  prismaAdapter: vi.fn(() => "adapter")
}));

vi.mock("@lib/prisma", () => ({ prisma: {} }));

describe("auth", () => {
  it("configures magic link to send email", async () => {
    // eslint-disable-next-line
    const module = await import("@app/lib/auth");
    const magicLinkPlugin = module.auth.plugins?.find((item) => "sendMagicLink" in item);
    const emailOtpPlugin = module.auth.plugins?.find((item) => "sendVerificationOTP" in item);
    await magicLinkPlugin.sendMagicLink({ email: "a@example.com", token: "t", url: "http://example" });
    await emailOtpPlugin.sendVerificationOTP({ email: "a@example.com", otp: "123456", type: "sign-in" });
    expect(sendEmail).toHaveBeenCalled();
  });
});
