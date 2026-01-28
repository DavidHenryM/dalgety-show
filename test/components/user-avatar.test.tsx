import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../test-utils";
import UserAvatar from "@components/UserAvatar";

const useSession = vi.fn();

vi.mock("@lib/auth-client", () => ({
  authClient: {
    useSession: () => useSession()
  }
}));

vi.mock("@lib/queries", () => ({
  getUserFromEmail: vi.fn().mockResolvedValue({
    id: "u",
    email: "a@example.com",
    firstName: "A",
    lastName: "B",
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  getOrganisations: vi.fn().mockResolvedValue([])
}));

vi.mock("@lib/mutations", () => ({
  updateUser: vi.fn().mockResolvedValue({ id: "u" })
}));

describe("UserAvatar", () => {
  it("renders sign in button when signed out", () => {
    useSession.mockReturnValue({ data: null });
    const { getByText } = renderWithProviders(<UserAvatar />);
    expect(getByText("Sign In")).toBeInTheDocument();
  });

  it("renders avatar when signed in", async () => {
    useSession.mockReturnValue({ data: { user: { email: "a@example.com", name: "Test User" } } });
    const { findByText } = renderWithProviders(<UserAvatar />);
    expect(await findByText("TU")).toBeInTheDocument();
  });
});
