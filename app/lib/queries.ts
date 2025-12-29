'use server'

import { Membership, Sponsorship, SponsorshipPackage, User } from "../generated/prisma/client";
import { Role } from "../generated/prisma/enums";
import { prisma } from "./prisma";

export async function getUserRole(email: string){
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      role: true,
      email: true, // Optional: include if you need both
    },
  })
  return user?.role
}

export async function getUsersWithRole(role: Role): Promise<Partial<User>[]>{
  const users = await prisma.user.findMany({
    where: {
      role: role,
    },
    select: {
      email: true,
      firstName: true,
      lastName: true,
    },
  })
  return users
}

export async function getSponsors(showYear: number): Promise<Partial<Sponsorship>[]>{
  const sponsors = await prisma.sponsorship.findMany({
    where: {
      show: {year: showYear},
    },
    select: {
      package: true,
      totalAmount: true,
      organisation: {
        select: {
          name: true,
          contactPerson: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
      },
    },
  })
  return sponsors
}

export async function getMemberships(): Promise<Partial<Membership>[]>{
  const memberships = await prisma.membership.findMany({
    select: {
      member: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      startDate: true,
      renewDate: true
    },
  })
  return memberships
}

export async function getSponsorshipPackages(): Promise<Partial<SponsorshipPackage>[]>{
  const sponsorshipPackages = await prisma.sponsorshipPackage.findMany({
    select: {
      tier: true,
      minimumAmount: true,
      maximumAmount: true
    },
  })
  return sponsorshipPackages
}




