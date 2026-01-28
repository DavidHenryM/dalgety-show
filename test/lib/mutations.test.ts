import { describe, expect, it, vi, beforeEach } from "vitest";
import * as mutations from "@app/lib/mutations";

const sendEmail = vi.hoisted(() => vi.fn().mockResolvedValue({}));

const prismaMock = vi.hoisted(() => ({
  sponsorship: { create: vi.fn() },
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    delete: vi.fn()
  },
  stallSiteCategory: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  organisation: { findUnique: vi.fn(), create: vi.fn() },
  stallApplication: { create: vi.fn() },
  stallInformation: { upsert: vi.fn() },
  stallSite: { update: vi.fn() },
  membership: { create: vi.fn(), delete: vi.fn() },
  membershipPackage: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  sponsorshipPackage: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  event: { create: vi.fn(), update: vi.fn(), delete: vi.fn(), findMany: vi.fn() },
  prize: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  activity: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  schedule: { update: vi.fn() },
  eventSection: { update: vi.fn() }
}));

vi.mock("@lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@app/lib/email", () => ({ sendEmail }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("mutations", () => {
  it("createSponsorship creates sponsorship", async () => {
    prismaMock.sponsorship.create.mockResolvedValue({ id: "s" });
    const result = await mutations.createSponsorship({} as never);
    expect(result.id).toBe("s");
  });

  it("createStallApplication creates application", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "u" });
    prismaMock.stallSiteCategory.findUnique.mockResolvedValue({ id: "c" });
    prismaMock.organisation.findUnique.mockResolvedValue(null);
    prismaMock.organisation.create.mockResolvedValue({ id: "org" });
    prismaMock.stallApplication.create.mockResolvedValue({ id: "app" });

    const result = await mutations.createStallApplication({
      email: "a@example.com",
      organisationName: "Org",
      stallSiteCategoryId: "c",
      preferredLocation: "loc",
      itemsToBeSoldOrDisplayed: "items"
    });

    expect(result.id).toBe("app");
  });

  it("updateStallInformation upserts", async () => {
    prismaMock.stallInformation.upsert.mockResolvedValue({ id: "info" });
    const result = await mutations.updateStallInformation("show", { welcomeMessage: "hi" });
    expect(result.id).toBe("info");
  });

  it("createStallSiteCategory creates", async () => {
    prismaMock.stallSiteCategory.create.mockResolvedValue({ id: "cat" });
    const result = await mutations.createStallSiteCategory({
      showId: "s",
      name: "A",
      sizeWidth: 1,
      sizeDepth: 2,
      basePrice: 10
    });
    expect(result.id).toBe("cat");
  });

  it("updateStallSiteCategory updates", async () => {
    prismaMock.stallSiteCategory.update.mockResolvedValue({ id: "cat" });
    const result = await mutations.updateStallSiteCategory("cat", {
      name: "A",
      sizeWidth: 1,
      sizeDepth: 2,
      basePrice: 10
    });
    expect(result.id).toBe("cat");
  });

  it("deleteStallSiteCategory deletes", async () => {
    prismaMock.stallSiteCategory.delete.mockResolvedValue({ id: "cat" });
    const result = await mutations.deleteStallSiteCategory("cat");
    expect(result.id).toBe("cat");
  });

  it("assignStallSiteToApplication updates", async () => {
    prismaMock.stallSite.update.mockResolvedValue({ id: "site" });
    const result = await mutations.assignStallSiteToApplication("site", "app");
    expect(result.id).toBe("site");
  });

  it("emailOfficialRole sends email", async () => {
    prismaMock.user.findMany.mockResolvedValue([{ email: "a@example.com" }]);
    const result = await mutations.emailOfficialRole({ role: "OWNER" as never, subject: "S", text: "T" });
    expect(result.sent).toBe(true);
    expect(sendEmail).toHaveBeenCalled();
  });

  it("updateUserName updates user", async () => {
    prismaMock.user.update.mockResolvedValue({ id: "u" });
    const result = await mutations.updateUserName("a@example.com", "A", "B");
    expect(result.id).toBe("u");
  });

  it("createUser creates user", async () => {
    prismaMock.user.create.mockResolvedValue({ id: "u" });
    const result = await mutations.createUser({
      email: "a@example.com",
      name: "A",
      role: "OWNER" as never,
      billingAddress: {
        streetNumber: 1,
        streetName: "Street",
        streetType: "Rd",
        suburb: "Town",
        state: "NSW" as never,
        country: "AU",
        postCode: 2000
      }
    });
    expect(result.id).toBe("u");
  });

  it("updateUserRole updates role", async () => {
    prismaMock.user.update.mockResolvedValue({ id: "u" });
    const result = await mutations.updateUserRole("u", "OWNER" as never, null);
    expect(result.id).toBe("u");
  });

  it("updateUser updates user", async () => {
    prismaMock.user.update.mockResolvedValue({ id: "u" });
    const result = await mutations.updateUser("u", { email: "a@example.com" });
    expect(result.id).toBe("u");
  });

  it("deleteUser deletes", async () => {
    prismaMock.user.delete.mockResolvedValue({ id: "u" });
    const result = await mutations.deleteUser("u");
    expect(result.id).toBe("u");
  });

  it("createOrganisation creates", async () => {
    prismaMock.organisation.create.mockResolvedValue({ id: "org" });
    const result = await mutations.createOrganisation({} as never);
    expect(result.id).toBe("org");
  });

  it("createMembership creates", async () => {
    prismaMock.membership.create.mockResolvedValue({ id: "m" });
    const result = await mutations.createMembership("INDIVIDUAL" as never, 10, "u");
    expect(result.id).toBe("m");
  });

  it("createMembershipPackage creates", async () => {
    prismaMock.membershipPackage.create.mockResolvedValue({ id: "pkg" });
    const result = await mutations.createMembershipPackage({
      type: "INDIVIDUAL" as never,
      cost: 10,
      validFrom: new Date(),
      termDays: 365
    });
    expect(result.id).toBe("pkg");
  });

  it("updateMembershipPackage updates", async () => {
    prismaMock.membershipPackage.update.mockResolvedValue({ id: "pkg" });
    const result = await mutations.updateMembershipPackage("pkg", { cost: 20 });
    expect(result.id).toBe("pkg");
  });

  it("deleteMembershipPackage deletes", async () => {
    prismaMock.membershipPackage.delete.mockResolvedValue({ id: "pkg" });
    const result = await mutations.deleteMembershipPackage("pkg");
    expect(result.id).toBe("pkg");
  });

  it("createSponsorshipPackage creates", async () => {
    prismaMock.sponsorshipPackage.create.mockResolvedValue({ id: "sp" });
    const result = await mutations.createSponsorshipPackage({
      tier: "SILVER",
      minimumAmount: 10,
      maximumAmount: 20
    });
    expect(result.id).toBe("sp");
  });

  it("updateSponsorshipPackage updates", async () => {
    prismaMock.sponsorshipPackage.update.mockResolvedValue({ id: "sp" });
    const result = await mutations.updateSponsorshipPackage("sp", { minimumAmount: 10 });
    expect(result.id).toBe("sp");
  });

  it("deleteSponsorshipPackage deletes", async () => {
    prismaMock.sponsorshipPackage.delete.mockResolvedValue({ id: "sp" });
    const result = await mutations.deleteSponsorshipPackage("sp");
    expect(result.id).toBe("sp");
  });

  it("createEvent creates event", async () => {
    prismaMock.event.create.mockResolvedValue({ id: "e" });
    const result = await mutations.createEvent({ eventName: "Name", sectionId: "sec" } as never, "show");
    expect(result.id).toBe("e");
  });

  it("updateEvent updates event", async () => {
    prismaMock.event.update.mockResolvedValue({ id: "e" });
    const result = await mutations.updateEvent({ eventName: "Name", sectionId: "sec" } as never, "e");
    expect(result.id).toBe("e");
  });

  it("deleteEvent deletes event", async () => {
    prismaMock.event.delete.mockResolvedValue({ id: "e" });
    const result = await mutations.deleteEvent("e");
    expect(result.id).toBe("e");
  });

  it("createPrize creates prize", async () => {
    prismaMock.prize.create.mockResolvedValue({ id: "p" });
    const result = await mutations.createPrize({ eventId: "e" });
    expect(result.id).toBe("p");
  });

  it("updatePrize updates prize", async () => {
    prismaMock.prize.update.mockResolvedValue({ id: "p" });
    const result = await mutations.updatePrize("p", { prizeName: "A" });
    expect(result.id).toBe("p");
  });

  it("deletePrize deletes prize", async () => {
    prismaMock.prize.delete.mockResolvedValue({ id: "p" });
    const result = await mutations.deletePrize("p");
    expect(result.id).toBe("p");
  });

  it("createActivity creates activity", async () => {
    prismaMock.activity.create.mockResolvedValue({ id: "a" });
    const result = await mutations.createActivity({ scheduleId: "s", time: new Date(), name: "N" });
    expect(result.id).toBe("a");
  });

  it("updateActivity updates activity", async () => {
    prismaMock.activity.update.mockResolvedValue({ id: "a" });
    const result = await mutations.updateActivity("a", { name: "N" });
    expect(result.id).toBe("a");
  });

  it("deleteActivity deletes activity", async () => {
    prismaMock.activity.delete.mockResolvedValue({ id: "a" });
    const result = await mutations.deleteActivity("a");
    expect(result.id).toBe("a");
  });

  it("updateSchedule updates schedule", async () => {
    prismaMock.schedule.update.mockResolvedValue({ id: "s" });
    const result = await mutations.updateSchedule("s", { released: new Date() });
    expect(result.id).toBe("s");
  });

  it("updateEventSection updates section", async () => {
    prismaMock.eventSection.update.mockResolvedValue({ id: "sec" });
    const result = await mutations.updateEventSection("sec", { description: "D" } as never);
    expect(result.id).toBe("sec");
  });
});
