import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../test-utils";
import { SignInButton, SignOutButton } from "@components/SignInOutButton";
import userEvent from "@testing-library/user-event";

const signOut = vi.hoisted(() => vi.fn().mockResolvedValue({}));

vi.mock("@lib/session", () => ({ signOut }));

describe("SignInOutButton", () => {
  it("renders sign in button", () => {
    const { getByText } = renderWithProviders(<SignInButton />);
    expect(getByText("Sign In")).toBeInTheDocument();
  });

  it("calls signOut on click", async () => {
    const user = userEvent.setup();
    const { getByText } = renderWithProviders(<SignOutButton />);
    await user.click(getByText("Sign Out"));
    expect(signOut).toHaveBeenCalled();
  });
});
