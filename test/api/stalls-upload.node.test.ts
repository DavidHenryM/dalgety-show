import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "@app/api/stalls/upload/route";

const getSession = vi.hoisted(() => vi.fn());
const put = vi.hoisted(() => vi.fn());

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers())
}));

vi.mock("@lib/auth", () => ({
  auth: { api: { getSession } }
}));

vi.mock("@vercel/blob", () => ({
  put
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function makeRequest(formData?: FormData) {
  return {
    nextUrl: new URL("http://localhost/api/stalls/upload"),
    formData: async () => formData ?? new FormData(),
    url: "http://localhost/api/stalls/upload"
  } as never;
}

describe("POST /api/stalls/upload", () => {
  it("returns 401 when unauthenticated", async () => {
    getSession.mockResolvedValue(null);
    const response = await POST(makeRequest());
    expect(response.status).toBe(401);
  });

  it("returns 400 when missing file", async () => {
    getSession.mockResolvedValue({ user: { email: "a@example.com" } });
    const response = await POST(makeRequest(new FormData()));
    expect(response.status).toBe(400);
  });

  it("returns 400 when invalid kind", async () => {
    getSession.mockResolvedValue({ user: { email: "a@example.com" } });
    const form = new FormData();
    form.append("file", new File(["data"], "file.png", { type: "image/png" }));
    form.append("kind", "invalid");
    const response = await POST(makeRequest(form));
    expect(response.status).toBe(400);
  });

  it("uploads file", async () => {
    process.env.BLOB_STORE_READ_WRITE_TOKEN = "token";
    getSession.mockResolvedValue({ user: { email: "a@example.com" } });
    put.mockResolvedValue({ url: "https://blob" });
    const form = new FormData();
    form.append("file", new File(["data"], "file.png", { type: "image/png" }));
    form.append("kind", "stall-image");
    const response = await POST(makeRequest(form));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.url).toBe("https://blob");
  });
});
