import { describe, expect, it, vi } from "vitest";
import { sendEmail } from "@app/lib/email";

const sendMail = vi.fn().mockResolvedValue({ messageId: "123" });

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail }))
  }
}));

describe("sendEmail", () => {
  it("sends email via nodemailer", async () => {
    process.env.EMAIL_HOST = "smtp.example.com";
    process.env.EMAIL_PORT = "587";
    process.env.EMAIL_USER = "user";
    process.env.EMAIL_PASSWORD = "pass";
    process.env.EMAIL_FROM = "no-reply@example.com";

    await sendEmail({ to: "test@example.com", subject: "Hello", text: "Hi" });

    expect(sendMail).toHaveBeenCalledWith({
      from: "no-reply@example.com",
      to: "test@example.com",
      subject: "Hello",
      text: "Hi"
    });
  });
});
