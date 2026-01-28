import { describe, expect, it } from "vitest";
import { SignupFormSchema } from "@app/lib/definitions";

describe("SignupFormSchema", () => {
  it("validates valid input", () => {
    const result = SignupFormSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "Passw0rd!"
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid input", () => {
    const result = SignupFormSchema.safeParse({
      name: "A",
      email: "bad",
      password: "short"
    });
    expect(result.success).toBe(false);
  });
});
