import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../test-utils";
import { CountDownCard } from "@components/CountDownCard";
import { waitFor } from "@testing-library/react";

const originalMatchMedia = globalThis.matchMedia;

describe("CountDownCard", () => {
  it("renders full card when not mobile", async () => {
    const target = new Date();
    target.setDate(target.getDate() + 5);

    const { getByText } = renderWithProviders(<CountDownCard countDownTo={target} />);

    await waitFor(() => {
      expect(getByText(/days to show day/i)).toBeInTheDocument();
    });
  });

  it("renders tooltip view on mobile", async () => {
    globalThis.matchMedia = ((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof globalThis.matchMedia;

    const target = new Date();
    target.setDate(target.getDate() + 3);

    const { getByText } = renderWithProviders(<CountDownCard countDownTo={target} />);

    await waitFor(() => {
      expect(getByText(/3|2|1|0/)).toBeInTheDocument();
    });

    globalThis.matchMedia = originalMatchMedia;
  });
});
