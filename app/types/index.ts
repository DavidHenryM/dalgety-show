import { BetterFetchError, SessionQueryParams } from "better-auth/client";
import type { FC } from "react";

export interface NavItem {
  label: string;
  path: string;
  Icon: FC
  Content: FC<any>
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
