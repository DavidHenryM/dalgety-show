import { describe, expect, it, vi } from "vitest";

vi.mock("@prisma/adapter-pg", () => ({
  PrismaPg: class {}
}));

class PrismaClientMock {}
vi.mock("@generated/client", () => ({
  PrismaClient: PrismaClientMock
}));

describe("prisma", () => {
  it("exports prisma client", async () => {
    // eslint-disable-next-line
    const module = await import("@app/lib/prisma");
    expect(module.prisma).toBeInstanceOf(PrismaClientMock);
  });
});
