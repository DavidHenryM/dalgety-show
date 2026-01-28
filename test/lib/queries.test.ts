import { describe, expect, it, vi, beforeEach } from "vitest";
import * as queries from "@app/lib/queries";

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn()
  },
  sponsorship: {
    findMany: vi.fn()
  },
  membership: {
    findMany: vi.fn()
  },
  membershipPackage: {
    findMany: vi.fn()
  },
  sponsorshipPackage: {
    findMany: vi.fn()
  },
  stallSiteCategory: {
    findMany: vi.fn()
  },
  show: {
    findFirst: vi.fn()
  },
  organisation: {
    findFirst: vi.fn(),
    findMany: vi.fn()
  },
  event: {
    findMany: vi.fn()
  },
  eventSection: {
    findMany: vi.fn(),
    findFirst: vi.fn()
  },
  schedule: {
    findFirstOrThrow: vi.fn(),
    findFirst: vi.fn()
  },
  stallInformation: {
    findFirst: vi.fn()
  },
  stallApplication: {
    findMany: vi.fn()
  },
  stallSite: {
    findMany: vi.fn()
  },
  activity: {
    findMany: vi.fn()
  }
}));

vi.mock("@lib/prisma", () => ({ prisma: prismaMock }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("queries", () => {
  it("getUserRole returns role", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ role: "OWNER" });
    const role = await queries.getUserRole("a@example.com");
    expect(role).toBe("OWNER");
  });

  it("getUsersWithRole returns list", async () => {
    prismaMock.user.findMany.mockResolvedValue([{ id: "1" }]);
    const users = await queries.getUsersWithRole("OWNER" as never);
    expect(users).toHaveLength(1);
  });

  it("getOwnerOfficials returns users", async () => {
    prismaMock.user.findMany.mockResolvedValue([{ id: "1" }]);
    const users = await queries.getOwnerOfficials();
    expect(users).toHaveLength(1);
  });

  it("getUserFromId returns user", async () => {
    prismaMock.user.findFirst.mockResolvedValue({ id: "1" });
    const user = await queries.getUserFromId("1");
    expect(user?.id).toBe("1");
  });

  it("getUserFromEmail returns user", async () => {
    prismaMock.user.findFirst.mockResolvedValue({ id: "1" });
    const user = await queries.getUserFromEmail("a@example.com");
    expect(user?.id).toBe("1");
  });

  it("getSponsors returns sponsors", async () => {
    prismaMock.sponsorship.findMany.mockResolvedValue([{ totalAmount: 5 }]);
    const sponsors = await queries.getSponsors(2024);
    expect(sponsors).toHaveLength(1);
  });

  it("getMemberships returns memberships", async () => {
    prismaMock.membership.findMany.mockResolvedValue([{ id: "1" }]);
    const memberships = await queries.getMemberships();
    expect(memberships).toHaveLength(1);
  });

  it("getSponsorshipPackages returns packages", async () => {
    prismaMock.sponsorshipPackage.findMany.mockResolvedValue([{ id: "1" }]);
    const packs = await queries.getSponsorshipPackages();
    expect(packs).toHaveLength(1);
  });

  it("getStallSiteCategories returns categories", async () => {
    prismaMock.stallSiteCategory.findMany.mockResolvedValue([{ id: "1" }]);
    const cats = await queries.getStallSiteCategories("show");
    expect(cats).toHaveLength(1);
  });

  it("getShow returns show", async () => {
    prismaMock.show.findFirst.mockResolvedValue({ id: "s" });
    const show = await queries.getShow(2024);
    expect(show?.id).toBe("s");
  });

  it("getNextShow returns next show", async () => {
    prismaMock.show.findFirst.mockResolvedValue({ id: "n" });
    const show = await queries.getNextShow();
    expect(show?.id).toBe("n");
  });

  it("getLastShow returns last show", async () => {
    prismaMock.show.findFirst.mockResolvedValue({ id: "l" });
    const show = await queries.getLastShow();
    expect(show?.id).toBe("l");
  });

  it("getShowOfInterest returns show", async () => {
    prismaMock.show.findFirst
      .mockResolvedValueOnce({ id: "next", start: new Date() })
      .mockResolvedValueOnce({ id: "last", start: new Date() });
    const show = await queries.getShowOfInterest();
    expect(show?.id).toBeDefined();
  });

  it("getOrganisation returns organisation", async () => {
    prismaMock.organisation.findFirst.mockResolvedValue({ id: "org" });
    const org = await queries.getOrganisation("Org", "1");
    expect(org?.id).toBe("org");
  });

  it("getEvents returns events", async () => {
    prismaMock.event.findMany.mockResolvedValue([{ id: "e" }]);
    const events = await queries.getEvents("show");
    expect(events).toHaveLength(1);
  });

  it("getEventSections returns sections", async () => {
    prismaMock.eventSection.findMany.mockResolvedValue([{ id: "sec" }]);
    const sections = await queries.getEventSections("show");
    expect(sections).toHaveLength(1);
  });

  it("getSchedule returns schedule", async () => {
    prismaMock.schedule.findFirstOrThrow.mockResolvedValue({ id: "sch" });
    const schedule = await queries.getSchedule("show");
    expect(schedule.id).toBe("sch");
  });

  it("getReleasedScheduleForShow returns schedule", async () => {
    prismaMock.schedule.findFirst.mockResolvedValue({ id: "sch" });
    const schedule = await queries.getReleasedScheduleForShow("show");
    expect(schedule?.id).toBe("sch");
  });

  it("getLatestReleasedSchedule returns schedule", async () => {
    prismaMock.schedule.findFirst.mockResolvedValue({ id: "sch" });
    const schedule = await queries.getLatestReleasedSchedule();
    expect(schedule?.id).toBe("sch");
  });

  it("getStallInformation returns info", async () => {
    prismaMock.stallInformation.findFirst.mockResolvedValue({ id: "info" });
    const info = await queries.getStallInformation("show");
    expect(info?.id).toBe("info");
  });

  it("getStallApplications returns applications", async () => {
    prismaMock.stallApplication.findMany.mockResolvedValue([{ id: "app" }]);
    const apps = await queries.getStallApplications();
    expect(apps).toHaveLength(1);
  });

  it("getStallSitesByCategory returns sites", async () => {
    prismaMock.stallSite.findMany.mockResolvedValue([{ id: "site" }]);
    const sites = await queries.getStallSitesByCategory("cat");
    expect(sites).toHaveLength(1);
  });

  it("getActivities returns activities", async () => {
    prismaMock.activity.findMany.mockResolvedValue([{ id: "act" }]);
    const activities = await queries.getActivities("sched");
    expect(activities).toHaveLength(1);
  });

  it("getEventSectionByName returns section", async () => {
    prismaMock.eventSection.findFirst.mockResolvedValue({ id: "sec" });
    const section = await queries.getEventSectionByName("name", "show");
    expect(section?.id).toBe("sec");
  });

  it("getOrganisations returns organisations", async () => {
    prismaMock.organisation.findMany.mockResolvedValue([{ name: "Org" }]);
    const orgs = await queries.getOrganisations("user");
    expect(orgs).toHaveLength(1);
  });

  it("getSectionEventsAndPrizes returns events", async () => {
    prismaMock.event.findMany.mockResolvedValue([{ id: "e" }]);
    const events = await queries.getSectionEventsAndPrizes("sec");
    expect(events).toHaveLength(1);
  });

  it("getSectionEvents returns events", async () => {
    prismaMock.event.findMany.mockResolvedValue([{ id: "e" }]);
    const events = await queries.getSectionEvents("sec");
    expect(events).toHaveLength(1);
  });

  it("getSectionEventsbySectionName returns events", async () => {
    prismaMock.event.findMany.mockResolvedValue([{ id: "e" }]);
    const events = await queries.getSectionEventsbySectionName("name");
    expect(events).toHaveLength(1);
  });

  it("getValidMembershipPackages returns packages", async () => {
    prismaMock.membershipPackage.findMany.mockResolvedValue([{ id: "pkg" }]);
    const packs = await queries.getValidMembershipPackages();
    expect(packs).toHaveLength(1);
  });

  it("getMembershipPackages returns packages", async () => {
    prismaMock.membershipPackage.findMany.mockResolvedValue([{ id: "pkg" }]);
    const packs = await queries.getMembershipPackages();
    expect(packs).toHaveLength(1);
  });

  it("getAllMemberships returns memberships", async () => {
    prismaMock.membership.findMany.mockResolvedValue([{ id: "m" }]);
    const members = await queries.getAllMemberships();
    expect(members).toHaveLength(1);
  });
});
