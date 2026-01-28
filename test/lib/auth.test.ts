import { describe, expect, it, vi } from "vitest";

const sendEmail = vi.fn();

vi.mock("@app/lib/email", () => ({ sendEmail }));

vi.mock("better-auth", () => ({
  betterAuth: vi.fn((config) => config)
}));

vi.mock("better-auth/plugins", () => ({
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
    const plugin = module.auth.plugins?.[0];
    await plugin.sendMagicLink({ email: "a@example.com", token: "t", url: "http://example" });
    expect(sendEmail).toHaveBeenCalled();
  });
});
