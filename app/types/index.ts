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
