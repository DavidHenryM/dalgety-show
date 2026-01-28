import "../setup-env";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../test-utils";
import { screen } from "@testing-library/react";
import Main from "@app/page";
import About from "@app/about/page";
import Contact from "@app/contact/page";
import Events from "@app/events/page";
import EventsYear from "@app/events/[year]/page";
import EventDetails from "@app/events/[year]/[section]/page";
import Gallery from "@app/gallery/page";
import GalleryYear from "@app/gallery/[year]/page";
import Schedule from "@app/schedule/page";
import ScheduleYear from "@app/schedule/[...year]/page";
import Sponsors from "@app/sponsors/page";
import SponsorTheShow from "@app/sponsors/sponsor/page";
import Membership from "@app/membership/page";
import MembershipApply from "@app/membership/apply/page";
import SignInPage from "@app/signin/page";
import SignInError from "@app/signin-error/page";
import Stalls from "@app/stalls/page";
import StallsYear from "@app/stalls/[year]/page";
import Admin from "@app/admin/page";

vi.mock("@app/events/[year]/page", () => ({
  default: () => <div>Events 2024</div>
}));

vi.mock("@app/events/[year]/[section]/page", () => ({
  default: () => <div>Loading Section events</div>
}));

vi.mock("@app/gallery/[year]/page", () => ({
  default: () => <div>Loading gallery images</div>
}));

vi.mock("@app/schedule/[...year]/page", () => ({
  default: () => <div>Program</div>
}));

vi.mock("@app/stalls/[year]/page", () => ({
  default: () => <div>Stalls 2024</div>
}));

vi.mock("@app/sponsors/page", () => ({
  default: () => <div>Sponsorship Packages</div>
}));

vi.mock("@app/sponsors/sponsor/page", () => ({
  default: () => <div>Sponsor The Show</div>
}));

vi.mock("@app/membership/page", () => ({
  default: () => <div>Become a Member</div>
}));

vi.mock("@app/membership/apply/page", () => ({
  default: () => <div>Become a Member</div>
}));

vi.mock("@app/signin/page", () => ({
  default: () => <div>Sign in</div>
}));

vi.mock("@app/signin-error/page", () => ({
  default: () => <div>Sign-in Error</div>
}));

vi.mock("@app/stalls/page", () => ({
  default: () => <div>Loading stalls</div>
}));

vi.mock("@app/admin/page", () => ({
  default: () => <div>Users</div>
}));

vi.mock("@lib/queryHooks", () => ({
  useUserRole: () => ["OWNER", false],
  useSponsors: () => [[{ organisation: { name: "Org", contactPerson: { firstName: "A", lastName: "B" } }, package: { tier: "SILVER" }, totalAmount: 10 }], false],
  useSponsorshipPackages: () => [[{ id: "sp", tier: "SILVER", minimumAmount: 10, maximumAmount: 20 }], false],
  useSchedule: () => [{ id: "sch", released: null }, [], false]
}));

vi.mock("@/app/lib/queryHooks", () => ({
  useUserRole: () => ["OWNER", false],
  useSponsors: () => [[{ organisation: { name: "Org", contactPerson: { firstName: "A", lastName: "B" } }, package: { tier: "SILVER" }, totalAmount: 10 }], false],
  useSponsorshipPackages: () => [[{ id: "sp", tier: "SILVER", minimumAmount: 10, maximumAmount: 20 }], false],
  useSchedule: () => [{ id: "sch", released: null }, [], false]
}));

vi.mock("@lib/queries", () => ({
  getOwnerOfficials: vi.fn().mockResolvedValue([{ id: "u", name: "Name", email: "a@example.com", officialRole: "OWNER" }]),
  getShow: vi.fn().mockResolvedValue({ id: "show", year: 2024, start: new Date(), end: new Date() }),
  getUserRole: vi.fn().mockResolvedValue("OWNER"),
  getEventSections: vi.fn().mockResolvedValue([{ id: "sec", name: "Section" }]),
  getEvents: vi.fn().mockResolvedValue([{ id: "e", name: "Event", sectionId: "sec", showId: "show" }]),
  getEventSectionByName: vi.fn().mockResolvedValue({ id: "sec", name: "Section" }),
  getSectionEventsbySectionName: vi.fn().mockResolvedValue([{ id: "e", name: "Event", sectionId: "sec", showId: "show" }]),
  getSectionEventsAndPrizes: vi.fn().mockResolvedValue([{ id: "e", name: "Event", prizes: [] }]),
  getReleasedScheduleForShow: vi.fn().mockResolvedValue({ id: "sch", showId: "show", released: new Date(), show: { year: 2024 } }),
  getLatestReleasedSchedule: vi.fn().mockResolvedValue({ id: "sch", showId: "show", released: new Date(), show: { year: 2024 } }),
  getSponsors: vi.fn().mockResolvedValue([]),
  getNextShow: vi.fn().mockResolvedValue({ id: "show", year: 2024, start: new Date(), end: new Date() }),
  getShowOfInterest: vi.fn().mockResolvedValue({ id: "show", year: 2024, start: new Date(), end: new Date() }),
  getMemberships: vi.fn().mockResolvedValue([]),
  getValidMembershipPackages: vi
    .fn()
    .mockResolvedValue([{ id: "pkg", type: "INDIVIDUAL", cost: 10 }]),
  getSponsorshipPackages: vi.fn().mockResolvedValue([]),
  getStallSiteCategories: vi.fn().mockResolvedValue([]),
  getStallInformation: vi.fn().mockResolvedValue(null)
}));

vi.mock("@/app/lib/queries", () => ({
  getOwnerOfficials: vi.fn().mockResolvedValue([{ id: "u", name: "Name", email: "a@example.com", officialRole: "OWNER" }]),
  getShow: vi.fn().mockResolvedValue({ id: "show", year: 2024, start: new Date(), end: new Date() }),
  getUserRole: vi.fn().mockResolvedValue("OWNER"),
  getEventSections: vi.fn().mockResolvedValue([{ id: "sec", name: "Section" }]),
  getEvents: vi.fn().mockResolvedValue([{ id: "e", name: "Event", sectionId: "sec", showId: "show" }]),
  getEventSectionByName: vi.fn().mockResolvedValue({ id: "sec", name: "Section" }),
  getSectionEventsbySectionName: vi.fn().mockResolvedValue([{ id: "e", name: "Event", sectionId: "sec", showId: "show" }]),
  getSectionEventsAndPrizes: vi.fn().mockResolvedValue([{ id: "e", name: "Event", prizes: [] }]),
  getReleasedScheduleForShow: vi.fn().mockResolvedValue({ id: "sch", showId: "show", released: new Date(), show: { year: 2024 } }),
  getLatestReleasedSchedule: vi.fn().mockResolvedValue({ id: "sch", showId: "show", released: new Date(), show: { year: 2024 } }),
  getSponsors: vi.fn().mockResolvedValue([]),
  getNextShow: vi.fn().mockResolvedValue({ id: "show", year: 2024, start: new Date(), end: new Date() }),
  getShowOfInterest: vi.fn().mockResolvedValue({ id: "show", year: 2024, start: new Date(), end: new Date() }),
  getMemberships: vi.fn().mockResolvedValue([]),
  getValidMembershipPackages: vi
    .fn()
    .mockResolvedValue([{ id: "pkg", type: "INDIVIDUAL", cost: 10 }]),
  getSponsorshipPackages: vi.fn().mockResolvedValue([]),
  getStallSiteCategories: vi.fn().mockResolvedValue([]),
  getStallInformation: vi.fn().mockResolvedValue(null)
}));

vi.mock("@lib/auth-client", () => ({
  authClient: {
    useSession: () => ({ data: { user: { email: "a@example.com", name: "Test" } }, isPending: false, isRefetching: false })
  }
}));

vi.mock("@/app/lib/auth-client", () => ({
  authClient: {
    useSession: () => ({ data: { user: { email: "a@example.com", name: "Test" } }, isPending: false, isRefetching: false })
  }
}));

describe("pages", () => {
  it("renders main", async () => {
    const { findByText } = renderWithProviders(
      <>
        <Main />
      </>
    );
    expect(await findByText(/82nd Annual Dalgety Show/i)).toBeInTheDocument();
  });

  it("renders about", async () => {
    const { findByText } = renderWithProviders(<About />);
    expect(await findByText("The Show")).toBeInTheDocument();
  });

  it("renders contact", async () => {
    const contact = await Contact();
    const { findByText } = renderWithProviders(contact);
    expect(await findByText("Contact")).toBeInTheDocument();
  });

  it("renders events page", async () => {
    const { findByText } = renderWithProviders(<Events />);
    expect(await findByText("Loading Events Page")).toBeInTheDocument();
  });

  it("renders events year page", async () => {
    renderWithProviders(<EventsYear params={Promise.resolve({ year: "2024" })} />);
    expect(await screen.findByText("Events 2024")).toBeInTheDocument();
  });

  it("renders event details page", async () => {
    renderWithProviders(
      <EventDetails params={Promise.resolve({ year: "2024", section: "Section" })} />
    );
    expect(await screen.findByText(/Loading Section events/i)).toBeInTheDocument();
  });

  it("renders gallery page", async () => {
    const { findByText } = renderWithProviders(<Gallery />);
    expect(await findByText("Loading Gallery")).toBeInTheDocument();
  });

  it("renders gallery year page", async () => {
    renderWithProviders(<GalleryYear params={Promise.resolve({ year: "2024" })} />);
    expect(await screen.findByText(/Loading gallery images/i)).toBeInTheDocument();
  });

  it("renders schedule page", async () => {
    const { findByText } = renderWithProviders(<Schedule />);
    expect(await findByText("Loading latest schedule")).toBeInTheDocument();
  });

  it("renders schedule year page", async () => {
    renderWithProviders(<ScheduleYear params={Promise.resolve({ year: "2024" })} />);
    expect(await screen.findByText("Program")).toBeInTheDocument();
  });

  it("renders sponsors page", async () => {
    const { findByText } = renderWithProviders(<Sponsors />);
    expect(await findByText(/Sponsorship Packages/i)).toBeInTheDocument();
  });

  it("renders sponsor the show page", async () => {
    const { findByText } = renderWithProviders(<SponsorTheShow />);
    expect(await findByText(/Sponsor The Show/i)).toBeInTheDocument();
  });

  it("renders membership page", async () => {
    const { findByText } = renderWithProviders(<Membership />);
    expect(await findByText(/Become a Member/i)).toBeInTheDocument();
  });

  it("renders membership apply page", async () => {
    const { findByText } = renderWithProviders(<MembershipApply />);
    expect(await findByText(/Become a Member/i)).toBeInTheDocument();
  });

  it("renders signin page", async () => {
    const { findAllByText } = renderWithProviders(<SignInPage />);
    expect((await findAllByText("Sign in")).length).toBeGreaterThan(0);
  });

  it("renders signin error page", async () => {
    const { findByText } = renderWithProviders(<SignInError />);
    expect(await findByText("Sign-in Error")).toBeInTheDocument();
  });

  it("renders stalls page", async () => {
    const { findByText } = renderWithProviders(<Stalls />);
    expect(await findByText("Loading stalls")).toBeInTheDocument();
  });

  it("renders stalls year page", async () => {
    renderWithProviders(<StallsYear params={Promise.resolve({ year: "2024" })} />);
    expect(await screen.findByText("Stalls 2024")).toBeInTheDocument();
  });

  it("renders admin page", async () => {
    const { findByText } = renderWithProviders(<Admin />);
    expect(await findByText("Users")).toBeInTheDocument();
  });
});
