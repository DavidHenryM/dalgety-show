import React from "react";
import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { TextDecoder, TextEncoder } from "util";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

if (!globalThis.TextEncoder) {
  // @ts-expect-error - set for tests
  globalThis.TextEncoder = TextEncoder;
}
if (!globalThis.TextDecoder) {
  // @ts-expect-error - set for tests
  globalThis.TextDecoder = TextDecoder;
}

if (!globalThis.matchMedia) {
  // @ts-expect-error - set for tests
  globalThis.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error - set for tests
globalThis.ResizeObserver = ResizeObserver;

class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error - set for tests
globalThis.IntersectionObserver = IntersectionObserver;

if (!globalThis.URL.createObjectURL) {
  // @ts-expect-error - set for tests
  globalThis.URL.createObjectURL = vi.fn(() => "blob:mock");
}

if (!globalThis.File) {
  // @ts-expect-error - set for tests
  globalThis.File = class File extends Blob {
    name: string;
    lastModified: number;
    constructor(parts: BlobPart[], name: string, options?: FilePropertyBag) {
      super(parts, options);
      this.name = name;
      this.lastModified = options?.lastModified ?? Date.now();
    }
  };
}

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn()
    }),
    usePathname: () => "/home",
    redirect: vi.fn()
  };
});

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  )
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : ""} alt={alt} {...rest} />
  )
}));

vi.mock("react-pdf", () => ({
  Document: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Page: () => <div>PDF Page</div>
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }: { rows?: unknown[] }) => (
    <div data-testid="data-grid">{rows ? rows.length : 0}</div>
  )
}));

vi.mock("@fortawesome/free-solid-svg-icons", () => ({
  fas: {},
  faHorse: {}
}));

vi.mock("@fortawesome/fontawesome-svg-core", () => ({
  library: { add: vi.fn() }
}));

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>Icon</span>
}));

vi.mock("@mui/lab/Timeline", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
vi.mock("@mui/lab/TimelineItem", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
vi.mock("@mui/lab/TimelineSeparator", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
vi.mock("@mui/lab/TimelineConnector", () => ({
  default: () => <div />
}));
vi.mock("@mui/lab/TimelineContent", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
vi.mock("@mui/lab/TimelineOppositeContent", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
vi.mock("@mui/lab/TimelineDot", () => ({
  default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>
}));

const mockFetch = vi.fn(async () => ({
  ok: true,
  json: async () => ({ images: [] })
}));
// @ts-expect-error - set for tests
globalThis.fetch = mockFetch;
if (typeof window !== "undefined") {
  // @ts-expect-error - set for tests
  window.fetch = mockFetch;
}
