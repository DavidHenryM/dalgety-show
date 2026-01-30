import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET, POST, DELETE, PUT } from "@app/api/queries/[action]/route";

const getSession = vi.hoisted(() => vi.fn());
const list = vi.hoisted(() => vi.fn());
const put = vi.hoisted(() => vi.fn());

const queries = vi.hoisted(() => ({
  getUserRole: vi.fn(),
  getUsersWithRole: vi.fn(),
  getUserFromEmail: vi.fn(),
  getSponsors: vi.fn(),
  getMemberships: vi.fn(),
  getSponsorshipPackages: vi.fn(),
  getShow: vi.fn(),
  getShowOfInterest: vi.fn(),
  getOrganisation: vi.fn(),
  getEvents: vi.fn(),
  getEventSections: vi.fn(),
  getEventSectionByName: vi.fn(),
  getOrganisations: vi.fn(),
  getSectionEventsAndPrizes: vi.fn(),
  getSectionEvents: vi.fn(),
  getSectionEventsbySectionName: vi.fn(),
  getValidMembershipPackages: vi.fn(),
  getAllMemberships: vi.fn()
}));

const mutations = vi.hoisted(() => ({
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn()
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers())
}));

vi.mock("@lib/auth", () => ({
  auth: { api: { getSession } }
}));

vi.mock("@vercel/blob", () => ({
  list,
  put
}));

vi.mock("@lib/queries", () => queries);
vi.mock("@lib/mutations", () => mutations);

beforeEach(() => {
  vi.clearAllMocks();
});

function makeRequest(url: string, body?: unknown) {
  return {
    nextUrl: new URL(url),
    url,
    json: async () => body,
    formData: async () => new FormData()
  } as never;
}

describe("/api/queries route", () => {
  it("GET returns 401 when unauthenticated", async () => {
    getSession.mockResolvedValue(null);
    const response = await GET(makeRequest("http://localhost/api/queries/getUserRole?action=getUserRole"), { params: Promise.resolve({}) });
    expect(response.status).toBe(401);
  });

  it("GET returns role for getUserRole", async () => {
    getSession.mockResolvedValue({ user: { email: "a@example.com" } });
    queries.getUserFromEmail.mockResolvedValue({ role: "OWNER" });
    queries.getUserRole.mockResolvedValue("OWNER");

    const response = await GET(makeRequest("http://localhost/api/queries/getUserRole?action=getUserRole&email=a@example.com"), { params: Promise.resolve({ action: "getUserRole" }) });
    expect(response.status).toBe(200);
  });

  it("POST creates event", async () => {
    getSession.mockResolvedValue({ user: { email: "a@example.com" } });
    queries.getUserRole.mockResolvedValue("OWNER");
    mutations.createEvent.mockResolvedValue({ id: "e" });
    const response = await POST(makeRequest("http://localhost/api/queries?action=createEvent&showId=1", { eventName: "A" }));
    expect(response.status).toBe(200);
  });

  it("DELETE deletes event", async () => {
    getSession.mockResolvedValue({ user: { email: "a@example.com" } });
    queries.getUserRole.mockResolvedValue("OWNER");
    mutations.deleteEvent.mockResolvedValue({ id: "e" });
    const response = await DELETE(makeRequest("http://localhost/api/queries?action=deleteEvent&id=e"));
    expect(response.status).toBe(200);
  });

  it("PUT uploads image", async () => {
    process.env.BLOB_STORE_READ_WRITE_TOKEN = "token";
    getSession.mockResolvedValue({ user: { email: "a@example.com" } });
    queries.getUserRole.mockResolvedValue("OWNER");
    put.mockResolvedValue({ url: "https://blob" });

    const form = new FormData();
    form.append("file", new File(["data"], "image.png", { type: "image/png" }));
    form.append("year", "2024");

    const request = {
      nextUrl: new URL("http://localhost/api/queries/uploadImage?action=uploadImage"),
      url: "http://localhost/api/queries/uploadImage?action=uploadImage",
      formData: async () => form
    } as never;

    const response = await PUT(request, { params: Promise.resolve({ action: "uploadImage" }) });
    expect(response.status).toBe(200);
  });

  it("GET getImages lists blobs", async () => {
    process.env.BLOB_STORE_READ_WRITE_TOKEN = "token";
    getSession.mockResolvedValue({ user: { email: "a@example.com" } });
    queries.getUserFromEmail.mockResolvedValue({ role: "OWNER" });
    list.mockResolvedValue({ blobs: [{ url: "https://blob/image.png" }] });
    const response = await GET(makeRequest("http://localhost/api/queries/getImages?action=getImages&prefix=gallery"), { params: Promise.resolve({ action: "getImages" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.images).toEqual(["https://blob/image.png"]);
  });
});
