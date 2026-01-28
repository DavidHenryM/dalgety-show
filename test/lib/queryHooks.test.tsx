import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import * as hooks from "@app/lib/queryHooks";

vi.mock("@app/utils", () => ({
  sleep: vi.fn(() => Promise.resolve())
}));

const mockQueries = vi.hoisted(() => ({
  getUserRole: vi.fn(),
  getUsersWithRole: vi.fn(),
  getSponsors: vi.fn(),
  getAllMemberships: vi.fn(),
  getSponsorshipPackages: vi.fn(),
  getMembershipPackages: vi.fn(),
  getStallApplications: vi.fn(),
  getShow: vi.fn(),
  getEvents: vi.fn(),
  getEventSections: vi.fn(),
  getSchedule: vi.fn(),
  getActivities: vi.fn()
}));

vi.mock("@lib/queries", () => mockQueries);

vi.mock("@lib/auth-client", () => ({
  authClient: {
    useSession: () => ({
      data: { user: { email: "a@example.com" } }
    })
  }
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("queryHooks", () => {
  it("useUserRole returns role", async () => {
    mockQueries.getUserRole.mockResolvedValue("OWNER");
    const { result } = renderHook(() => hooks.useUserRole());
    await waitFor(() => expect(result.current[0]).toBe("OWNER"));
  });

  it("useUsersWithRole returns users", async () => {
    mockQueries.getUsersWithRole.mockResolvedValue([{ id: "1" }]);
    const { result } = renderHook(() => hooks.useUsersWithRole("OWNER" as never));
    await waitFor(() => expect(result.current[0]).toHaveLength(1));
  });

  it("useSponsors returns sponsors", async () => {
    mockQueries.getSponsors.mockResolvedValue([{ id: "1" }]);
    const { result } = renderHook(() => hooks.useSponsors(2024));
    await waitFor(() => expect(result.current[0]).toHaveLength(1));
  });

  it("useMemberships returns memberships", async () => {
    mockQueries.getAllMemberships.mockResolvedValue([{ id: "1" }]);
    const { result } = renderHook(() => hooks.useMemberships());
    await waitFor(() => expect(result.current[0]).toHaveLength(1));
  });

  it("useStallApplications returns applications", async () => {
    mockQueries.getStallApplications.mockResolvedValue([{ id: "1" }]);
    const { result } = renderHook(() => hooks.useStallApplications());
    await waitFor(() => expect(result.current[0]).toHaveLength(1));
  });

  it("useSponsorshipPackages returns packages", async () => {
    mockQueries.getSponsorshipPackages.mockResolvedValue([{ id: "1" }]);
    const { result } = renderHook(() => hooks.useSponsorshipPackages());
    await waitFor(() => expect(result.current[0]).toHaveLength(1));
  });

  it("useMembershipPackages returns packages", async () => {
    mockQueries.getMembershipPackages.mockResolvedValue([{ id: "1" }]);
    const { result } = renderHook(() => hooks.useMembershipPackages());
    await waitFor(() => expect(result.current[0]).toHaveLength(1));
  });

  it("useEvents returns events", async () => {
    mockQueries.getShow.mockResolvedValue({ id: "show" });
    mockQueries.getEvents.mockResolvedValue([{ id: "e" }]);
    const { result } = renderHook(() => hooks.useEvents(2024));
    await waitFor(() => expect(result.current[0]).toHaveLength(1));
  });

  it("useEventSections returns sections", async () => {
    mockQueries.getShow.mockResolvedValue({ id: "show" });
    mockQueries.getEventSections.mockResolvedValue([{ id: "sec" }]);
    const { result } = renderHook(() => hooks.useEventSections(2024));
    await waitFor(() => expect(result.current[0]).toHaveLength(1));
  });

  it("useSchedule returns schedule and activities", async () => {
    mockQueries.getShow.mockResolvedValue({ id: "show" });
    mockQueries.getSchedule.mockResolvedValue({ id: "sched" });
    mockQueries.getActivities.mockResolvedValue([{ id: "a" }]);
    const { result } = renderHook(() => hooks.useSchedule(2024));
    await waitFor(() => expect(result.current[0]?.id).toBe("sched"));
    await waitFor(() => expect(result.current[1]).toHaveLength(1));
  });
});
