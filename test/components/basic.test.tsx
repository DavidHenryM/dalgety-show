import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test-utils";
import { Background } from "@components/Background";
import { BulletList } from "@components/BulletList";
import Content from "@components/Content";
import Footer from "@components/Footer";
import SectionCard from "@components/SectionCard";
import UnAuthorised from "@components/UnAuthorised";
import Waiting from "@components/Waiting";
import { DropDownGrid } from "@components/DropDownGrid";
import { AlertDialog, Snack } from "@components/Alert";
import { TransitionUp } from "@components/Tansitions";

const image = { src: "/test.png" } as never;

describe("basic components", () => {
  it("renders basic components", () => {
    const { getByText, getAllByText } = renderWithProviders(
      <>
        <Background image={image} />
        <BulletList listItems={["One", "Two"]} />
        <Content backgroundImageIndex={0}>
          <div>Content</div>
        </Content>
        <Footer />
        <SectionCard title="Section">Child</SectionCard>
        <UnAuthorised />
        <Waiting message="Loading" open={false} />
        <DropDownGrid rows={[]} columns={[]} loading={false} title="Grid" />
        <AlertDialog title="Title" message="Message" open={true} setOpen={() => {}} redirect="" />
        <Snack message="Saved" open={true} setOpen={() => {}} severity="success" />
        <TransitionUp in={true}>{<div>Slide</div>}</TransitionUp>
      </>
    );

    expect(getByText("Content")).toBeInTheDocument();
    expect(getByText("Section")).toBeInTheDocument();
    expect(getAllByText(/Dalgety Show Society/i).length).toBeGreaterThan(0);
  });
});
