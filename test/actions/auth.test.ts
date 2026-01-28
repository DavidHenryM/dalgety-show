import { describe, expect, it, vi } from "vitest";
import { signIn } from "@app/actions/auth";

const magicLink = vi.hoisted(() => vi.fn());
const safeParse = vi.hoisted(() => vi.fn());

vi.mock("@app/lib/definitions", () => ({
  SignupFormSchema: { safeParse }
}));

vi.mock("@lib/auth-client", () => ({
  authClient: {
    signIn: {
      magicLink
    }
  }
}));

describe("actions/auth signIn", () => {
  it("returns errors on invalid input", async () => {
    safeParse.mockReturnValue({
      success: false,
      error: { flatten: () => ({ fieldErrors: { email: ["Invalid"] } }) }
    });
    const formData = new FormData();
    formData.set("name", "A");
    formData.set("email", "invalid");

    const result = await signIn(undefined, formData);

    expect(result?.errors).toBeDefined();
    expect(magicLink).not.toHaveBeenCalled();
  });

  it("returns message on success", async () => {
    safeParse.mockReturnValue({
      success: true,
      data: { name: "Alice", email: "alice@example.com" }
    });
    magicLink.mockResolvedValue({ data: {}, error: null });
    const formData = new FormData();
    formData.set("name", "Alice");
    formData.set("email", "alice@example.com");

    const result = await signIn(undefined, formData, "/home");

    expect(magicLink).toHaveBeenCalled();
    expect(result?.message).toContain("Magic link sent");
  });

  it("returns error message on auth error", async () => {
    safeParse.mockReturnValue({
      success: true,
      data: { name: "Alice", email: "alice@example.com" }
    });
    magicLink.mockResolvedValue({ data: null, error: { message: "Oops" } });
    const formData = new FormData();
    formData.set("name", "Alice");
    formData.set("email", "alice@example.com");

    const result = await signIn(undefined, formData, "/home");

    expect(result?.errors?.email?.[0]).toBe("Oops");
  });
});
