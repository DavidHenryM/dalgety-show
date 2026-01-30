import { BetterFetchError, SessionQueryParams } from "better-auth/client";
import type { JSX } from "react";
import { Gender } from "../generated/prisma/browser";
import { OfficialRole, Role, SponsorshipPackage, State } from "../generated/prisma/client";

export interface NavItem {
  label: string;
  path: string;
  Icon: JSX.ElementType;
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
  results: {
    id: string;
    prizeId: string | null;
    eventId: string;
    prize: {
      id: string;
      prizeName: string | null;
      cashPrizeValue: number | null;
      trophyName: string | null;
      ribbonName: string | null;
    } | null;
    winner: {
      firstName: string | null;
      lastName: string | null;
      name: string;
    }[];
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
    id?: number
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

export type MembershipPackageForm = {
  id: number
  packageId: string
  type: 'INDIVIDUAL' | 'FAMILY'
  cost: string | number
  validFrom: string
  validTo: string
  termDays: string | number
}

export type SponsorshipPackageForm = {
  id: number
  packageId: string
  tier: 'PLATNIUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'SECTION'
  minimumAmount: string | number
  maximumAmount: string | number
}

export type Sponsor = {
  package: SponsorshipPackage,
  totalAmount: string | number,
  organisation: {
    name: string,
    contactPerson: {
      firstName: string | null
      lastName: string | null
    }
  }
}

export type UserReturn = {
  name: string;
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  mobileNumber: string | null;
  landlineNumber: string | null;
  role: Role;
  officialRole: OfficialRole | null;
  billingAddress: {
      id: string;
      unit: number | null;
      streetNumber: number;
      postCode: number;
      streetName: string;
      streetType: string;
      suburb: string;
      state: State;
      country: string;
  } | null;
  shippingAddress: {
      id: string;
      unit: number | null;
      streetNumber: number;
      postCode: number;
      streetName: string;
      streetType: string;
      suburb: string;
      state: State;
      country: string;
  } | null;
  organisation?: {
    name: string;
  }[]
  chiefStewardOfEventSections: { name: string; letter: string | null; }[]
  eventResults: { id: string; eventId: string; }[]
}

export type BetterAuthError = {
    code?: string | undefined | undefined;
    message?: string | undefined | undefined;
    status: number;
    statusText: string;
} | null

export type BetterAuthSignInData = {
    status: boolean;
} | null

export type BetterAuthSignInOtpData = {
    token: string;
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
    };
} | null

export type BetterAuthSignOutData = {
    success: boolean;
} | null