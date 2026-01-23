import { BetterFetchError, SessionQueryParams } from "better-auth/client";
import type { FC } from "react";
import { Gender } from "../generated/prisma/browser";

export interface NavItem {
  label: string;
  path: string;
  Icon: FC
  Content: FC<unknown>
}

export interface EventItem {
  title: string;
  time: string;
  description?: string;
}

export type Contact = {
  name: string
  role: string
  phone?: string
  email: string
  avatarPath?: string
}


export type SessionData = {
  data: {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
    };
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
    };
    } | null;
    isPending: boolean;
    isRefetching: boolean;
    error: BetterFetchError | null;
    refetch: (queryParams?: {
        query?: SessionQueryParams;
    } | undefined) => Promise<void>;
}


export type SectionEventandPrizes = 
  ({
    prizes: {
        id: string;
        prizeName: string | null;
        cashPrizeValue: number | null;
        trophyName: string | null;
        ribbonName: string | null;
        eventResultId: string | null;
        eventId: string;
    }[];
} & {
    name: string;
    id: string;
    description: string | null;
    image: string | null;
    sectionId: string;
    showId: string;
    maximumAge: number | null;
    minimumAge: number | null;
    gender: Gender;
    entryFee: number | null;
    entryFeeTeam: number | null;
})

export type EventTableForm = {
    id: number
    eventName?: string
    eventId?: string
    description?: string
    sectionId?: string,
    maximumAge?: string | number
    minimumAge?: string | number
    gender?: Gender
    entryFee?: string | number
    entryFeeTeam?: string | number
  }

export type PrizeTableForm = {
  id: number
  prizeId: string
  prizeName: string
  cashPrizeValue: string | number
  trophyName: string
  ribbonName: string
}

export type ActivitiesTableForm = {
  id: number
  activityId: string
  time: string
  name: string
  description: string
  link: string
  icon: string
}
