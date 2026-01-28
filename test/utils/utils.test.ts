import { describe, expect, it, vi } from "vitest";
import {
  dateDiffInDays,
  getDateString,
  getNextShowDate,
  splitFilePath,
  getRandomIntInclusive,
  sleep,
  simpleDateString
} from "@app/utils";

describe("utils", () => {
  it("dateDiffInDays returns day difference ignoring time", () => {
    const a = new Date(2024, 0, 1);
    const b = new Date(2024, 0, 2);
    expect(dateDiffInDays(a, b)).toBe(1);
  });

  it("getDateString formats ordinal date", () => {
    const date = new Date("2024-03-03T10:00:00Z");
    expect(getDateString(date)).toContain("3rd");
  });

  it("getNextShowDate returns second Sunday of March in future", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-04-01T00:00:00Z"));
    const next = getNextShowDate();
    expect(next.getMonth()).toBe(2);
    vi.useRealTimers();
  });

  it("splitFilePath returns directory and file name", () => {
    expect(splitFilePath("/users/joe/notes.txt")).toEqual(["/users/joe", "notes.txt"]);
  });

  it("getRandomIntInclusive returns within range", () => {
    for (let i = 0; i < 10; i += 1) {
      const value = getRandomIntInclusive(1, 3);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(3);
    }
  });

  it("sleep resolves after time", async () => {
    vi.useFakeTimers();
    const promise = sleep(1000);
    vi.advanceTimersByTime(1000);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it("simpleDateString formats yyyy-mm-dd", () => {
    const date = new Date("2024-02-09T10:00:00Z");
    expect(simpleDateString(date)).toBe("2024-02-09");
  });
});
