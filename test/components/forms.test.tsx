import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Providers } from "../test-utils";
import { renderToStaticMarkup } from "react-dom/server";
import { MembershipForm } from "@components/MembershipForm";
import { SponsorTheShowForm } from "@components/SponsorTheShowForm";
import { StallApplicationForm } from "@components/StallApplicationForm";

vi.mock("@components/Waiting", () => ({
  default: () => <div>Waiting</div>
}));

vi.mock("@components/Alert", () => ({
  AlertDialog: () => <div>Alert</div>,
  Snack: () => <div>Snack</div>
}));

const formMethods = vi.hoisted(() => ({
  control: {},
  setValue: vi.fn(),
  handleSubmit: (cb: (data: unknown) => void) => () => cb({})
}));

vi.mock("react-hook-form", () => ({
  useForm: () => formMethods,
  Controller: ({ render }: { render: (props: { field: { value: string; onChange: () => void; name: string } }) => React.ReactNode }) =>
    render({ field: { value: "", onChange: () => {}, name: "field" } })
}));

vi.mock("@lib/queryHooks", () => ({
  useSponsorshipPackages: () => [[
    { id: "p1", tier: "SILVER", minimumAmount: 10, maximumAmount: 20 },
    { id: "p2", tier: "GOLD", minimumAmount: 21, maximumAmount: 40 },
    { id: "p3", tier: "PLATNIUM", minimumAmount: 41, maximumAmount: 80 }
  ], false]
}));

vi.mock("@lib/queries", () => ({
  getValidMembershipPackages: vi.fn().mockResolvedValue([
    { id: "pkg", type: "INDIVIDUAL", cost: 10, validFrom: new Date(), termDays: 365 }
  ]),
  getOrganisation: vi.fn().mockResolvedValue(null),
  getNextShow: vi.fn().mockResolvedValue({ id: "show" }),
  getStallSiteCategories: vi.fn().mockResolvedValue([{ id: "cat", name: "Category" }]),
  getUserFromEmail: vi.fn().mockResolvedValue({ firstName: "A", lastName: "B", mobileNumber: "1" })
}));

vi.mock("@lib/mutations", () => ({
  createMembership: vi.fn(),
  emailOfficialRole: vi.fn(),
  updateUserName: vi.fn().mockResolvedValue({ id: "u" }),
  createOrganisation: vi.fn().mockResolvedValue({ id: "org" }),
  createSponsorship: vi.fn().mockResolvedValue({ id: "s" }),
  createStallApplication: vi.fn().mockResolvedValue({ id: "app" })
}));

describe("form components", () => {
  it("renders MembershipForm", async () => {
    const html = renderToStaticMarkup(
      <Providers>
        <MembershipForm email="a@example.com" />
      </Providers>
    );
    expect(html).toContain("Become a Member");
  });

  it("renders SponsorTheShowForm", async () => {
    const html = renderToStaticMarkup(
      <Providers>
        <SponsorTheShowForm email="a@example.com" />
      </Providers>
    );
    expect(html).toContain("Sponsor The Show");
  });

  it("renders StallApplicationForm", async () => {
    const html = renderToStaticMarkup(
      <Providers>
        <StallApplicationForm email="a@example.com" userName="A B" showId="show" />
      </Providers>
    );
    expect(html).toContain("Apply for a Stall");
  });
});
