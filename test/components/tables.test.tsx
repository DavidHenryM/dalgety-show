import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../test-utils";
import { ActivitiesTable } from "@components/ActivitiesTable";
import { EventsTable } from "@components/EventsTable";
import { EventsSectionTable } from "@components/EventsSectionTable";
import { MembershipPackagesTable } from "@components/MembershipPackagesTable";
import { SponsorshipPackagesTable } from "@components/SponsorshipPackagesTable";
import { StallApplicationsTable } from "@components/StallApplicationsTable";
import { StallSiteCategoriesTable } from "@components/StallSiteCategoriesTable";
import { MembershipsTable } from "@components/MembershipsTable";
import { SponsorsTable } from "@components/SponsorsTable";
import { UsersRoleTable } from "@components/UsersRoleTable";

vi.mock("@lib/queryHooks", () => ({
  useSchedule: () => [{ id: "sched", released: null }, [{
    id: "a",
    time: new Date(),
    name: "Activity",
    description: null,
    link: null,
    icon: null
  }], false],
  useEvents: () => [[{ id: "e", name: "Event", sectionId: "sec", showId: "show" }], false],
  useEventSections: () => [[{ id: "sec", name: "Section" }], false],
  useMembershipPackages: () => [[{ id: "pkg", type: "INDIVIDUAL", cost: 10, validFrom: new Date(), termDays: 365 }], false],
  useSponsorshipPackages: () => [[{ id: "sp", tier: "SILVER", minimumAmount: 10, maximumAmount: 20 }], false],
  useStallApplications: () => [[{
    id: "app",
    stallSiteCategoryId: "cat",
    applicant: { firstName: "A", lastName: "B", email: "a@example.com" },
    organisation: { name: "Org" },
    stallSiteCategory: { name: "Cat" },
    stallSites: [],
    preferredLocation: "Loc",
    itemsToBeSoldOrDisplayed: "Items",
    applicationDate: new Date(),
    approved: false,
    approvedDate: null,
    stallSetupImageLink: null,
    publicLiabilityInsuranceLink: null
  }], false],
  useMemberships: () => [[{
    id: "m",
    member: { firstName: "A", lastName: "B", email: "a@example.com" },
    type: "INDIVIDUAL",
    cost: 10,
    applyDate: new Date(),
    paidDate: null
  }], false],
  useSponsors: () => [[{
    organisation: { name: "Org", contactPerson: { firstName: "A", lastName: "B" } },
    package: { tier: "SILVER" },
    totalAmount: 10
  }], false],
  useUsersWithRole: () => [[{ id: "u", email: "a@example.com", firstName: "A", lastName: "B", role: "OWNER" }], false]
}));

vi.mock("@lib/queries", () => ({
  getShow: vi.fn().mockResolvedValue({ id: "show" }),
  getEventSectionByName: vi.fn().mockResolvedValue({ id: "sec", name: "Section" }),
  getSectionEventsAndPrizes: vi.fn().mockResolvedValue([{ id: "e", name: "Event", prizes: [] }]),
  getStallSitesByCategory: vi.fn().mockResolvedValue([{ id: "site", siteNumber: 1 }])
}));

vi.mock("@lib/mutations", () => ({
  createActivity: vi.fn(),
  updateActivity: vi.fn(),
  deleteActivity: vi.fn(),
  updateSchedule: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
  createPrize: vi.fn(),
  updatePrize: vi.fn(),
  deletePrize: vi.fn(),
  createMembershipPackage: vi.fn(),
  updateMembershipPackage: vi.fn(),
  deleteMembershipPackage: vi.fn(),
  createSponsorshipPackage: vi.fn(),
  updateSponsorshipPackage: vi.fn(),
  deleteSponsorshipPackage: vi.fn(),
  assignStallSiteToApplication: vi.fn(),
  createStallSiteCategory: vi.fn(),
  updateStallSiteCategory: vi.fn(),
  deleteStallSiteCategory: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn()
}));

describe("table components", () => {
  it("renders tables", async () => {
    const { findByText } = renderWithProviders(
      <>
        <ActivitiesTable title="Activities" showYear={2024} />
        <EventsTable title="Events" showYear={2024} />
        <EventsSectionTable title="Section Events" showYear={2024} sectionName="Section" />
        <MembershipPackagesTable title="Membership Packages" />
        <SponsorshipPackagesTable title="Sponsorship Packages" />
        <StallApplicationsTable title="Stall Applications" />
        <StallSiteCategoriesTable showId="show" categories={[]} onUpdated={() => {}} />
        <MembershipsTable title="Memberships" />
        <SponsorsTable title="Sponsors" showYear={2024} />
        <UsersRoleTable title="Users" role={"OWNER" as never} />
      </>
    );

    expect(await findByText("Activities")).toBeInTheDocument();
    expect(await findByText("Events")).toBeInTheDocument();
    expect(await findByText("Section Events")).toBeInTheDocument();
  });
});
