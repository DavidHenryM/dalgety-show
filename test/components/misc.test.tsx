import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../test-utils";
import ContactCard from "@components/ContactCard";
import EditLock from "@components/EditLock";
import { EventSectionCard } from "@components/EventSectionCard";
import { PdfViewer } from "@components/PdfViewer";
import RestrictedAccess from "@components/Restricted";

vi.mock("@lib/queryHooks", () => ({
  useUserRole: () => ["OWNER", false]
}));

vi.mock("@app/lib/mutations", () => ({
  updateEventSection: vi.fn().mockResolvedValue({ description: "Updated" })
}));

vi.mock("pdfjs-dist/build/pdf.mjs", () => ({
  GlobalWorkerOptions: { workerSrc: "" }
}));

describe("misc components", () => {
  it("renders ContactCard", () => {
    const { getByText } = renderWithProviders(
      <ContactCard contact={{
        id: "u",
        name: "Name",
        email: "a@example.com",
        officialRole: "OWNER" as never
      } as never} />
    );
    expect(getByText(/OWNER/i)).toBeInTheDocument();
  });

  it("renders EditLock", () => {
    const { getByLabelText } = renderWithProviders(
      <EditLock locked={true} setLocked={() => {}} userFirstName="A" />
    );
    expect(getByLabelText("unlock")).toBeInTheDocument();
  });

  it("renders EventSectionCard", () => {
    const { getByText } = renderWithProviders(
      <EventSectionCard
        section={{ id: "sec", name: "Section", description: "Desc", image: "" } as never}
        locked={true}
        show={{ id: "show", year: 2024 } as never}
      />
    );
    expect(getByText("Section")).toBeInTheDocument();
  });

  it("renders PdfViewer", () => {
    const { getByText } = renderWithProviders(<PdfViewer pdfFilePath="/test.pdf" />);
    expect(getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders RestrictedAccess", () => {
    const { getByText } = renderWithProviders(
      <RestrictedAccess explicit={true}><div>Secret</div></RestrictedAccess>
    );
    expect(getByText("Secret")).toBeInTheDocument();
  });
});
