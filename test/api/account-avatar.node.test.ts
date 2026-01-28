import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "@app/api/account/avatar/route";

const getSession = vi.hoisted(() => vi.fn());
const put = vi.hoisted(() => vi.fn());
const prismaMock = vi.hoisted(() => ({
  user: { update: vi.fn() }
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers())
}));

vi.mock("@lib/auth", () => ({
  auth: { api: { getSession } }
}));

vi.mock("@vercel/blob", () => ({
  put
}));

vi.mock("@lib/prisma", () => ({ prisma: prismaMock }));

beforeEach(() => {
  vi.clearAllMocks();
});

function makeRequest(formData?: FormData) {
  return {
    nextUrl: new URL("http://localhost/api/account/avatar"),
    formData: async () => formData ?? new FormData(),
    url: "http://localhost/api/account/avatar"
  } as never;
}

describe("POST /api/account/avatar", () => {
  it("returns 401 when unauthenticated", async () => {
    getSession.mockResolvedValue(null);
    const response = await POST(makeRequest());
    expect(response.status).toBe(401);
  });

  it("returns 400 when no file", async () => {
    getSession.mockResolvedValue({ user: { id: "u" } });
    const response = await POST(makeRequest(new FormData()));
    expect(response.status).toBe(400);
  });

  it("returns 400 when file is not image", async () => {
    getSession.mockResolvedValue({ user: { id: "u" } });
    const form = new FormData();
    const file = new File(["data"], "test.txt", { type: "text/plain" });
    form.append("file", file);
    const response = await POST(makeRequest(form));
    expect(response.status).toBe(400);
  });

  it("uploads and updates user", async () => {
    process.env.BLOB_STORE_READ_WRITE_TOKEN = "token";
    getSession.mockResolvedValue({ user: { id: "u" } });
    put.mockResolvedValue({ url: "https://blob" });
    prismaMock.user.update.mockResolvedValue({ id: "u" });
    const form = new FormData();
    const file = new File(["data"], "avatar.png", { type: "image/png" });
    form.append("file", file);
    const response = await POST(makeRequest(form));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.url).toBe("https://blob");
  });
});
