import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../test-utils";
import Navbar from "@components/Navbar";
import { TopBar } from "@components/TopBar";

vi.mock("@lib/queryHooks", () => ({
  useUserRole: () => ["OWNER", false]
}));

vi.mock("@lib/queries", () => ({
  getNextShow: vi.fn().mockResolvedValue({ start: new Date().toISOString() })
}));

vi.mock("@components/UserAvatar", () => ({
  default: () => <div>UserAvatar</div>
}));

describe("Navbar and TopBar", () => {
  it("renders Navbar", () => {
    const { findByText } = renderWithProviders(
      <Navbar
        drawerOpen={true}
        darkModeActive={false}
        setDarkModeActive={() => {}}
        setDrawerOpen={() => {}}
      />
    );

    return expect(findByText("HOME")).resolves.toBeInTheDocument();
  });

  it("renders TopBar", () => {
    const { getByText } = renderWithProviders(
      <TopBar
        darkModeActive={false}
        setDarkModeActiveAction={() => {}}
        drawerOpen={true}
        setDrawerOpenAction={() => {}}
      />
    );

    expect(getByText(/Dalgety Show/i)).toBeInTheDocument();
  });
});
