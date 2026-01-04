'use server'

import { EventSection, Membership, Show, Sponsorship, SponsorshipPackage, User, Event, MembershipPackage } from "../generated/prisma/client";
import { Role, State } from "../generated/prisma/enums";
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
      officialRole: true
    },
  })
  return users
}

export async function getUserFromEmail(email: string): Promise<User | null>{
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    }
  })

  return user
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
      id: true,
      tier: true,
      minimumAmount: true,
      maximumAmount: true
    },
  })
  return sponsorshipPackages
}

export async function getShow(year: number): Promise<Show | null> {
  const show = await prisma.show.findFirst({
    where: {
      year: year
    }
  })
  return show
}

export async function getOrganisation(name: string, contactPersonId: string){
  const organisation = prisma.organisation.findFirst({
    where: {
        name: name,
        contactPersonId: contactPersonId
      }
  })
  return organisation
}

export async function getEvents(showId: string): Promise<Event[]>{
  const events = prisma.event.findMany({
    where: {
      showId: showId
    }
  })
  if (events){
    return events
  } else {
    return []
  }
}

export type GetEventsResult = {
    name: string
    id: string
    sectionId: string
    category: string | null
    showId: string
}

export async function getEventSections(showId: string): Promise<EventSection[]> {
  const events = prisma.eventSection.findMany({
    where: {
      showId: showId
    }
  })
  if (events){
    return events
  } else {
    return []
  }
}

export async function getEventSectionByName(name: string, showId: string): Promise<EventSection | null> {
  const events = prisma.eventSection.findFirst({
    where: {
      showId: showId,
      name: name
    }
  })
  if (events){
    return events
  } else {
    return null
  }
}

export type GetEventSectionsResult = {
  id: string;
  image: string | null;
  name: string;
  showId: string;
  letter: string | null;
  eventSectionSponsorshipId: number | null;
  chiefStewardId: string | null
  description: string | null
  
}

export async function getOrganisations(contactPersonId: string): Promise<GetOrganisationsResult[]> {
  const organisations = prisma.organisation.findMany({
    where: {
      contactPersonId: contactPersonId
    },
    select: {
      shippingAddress: true,
      billingAddress: true,
      name: true
    }
  })
  return organisations
}

export type GetOrganisationsResult = {
    name: string;
    billingAddress: {
        id: string;
        unit: number | null;
        streetNumber: number;
        streetName: string;
        streetType: string;
        suburb: string;
        state: State;
        country: string;
        postCode: number;
    } | null;
    shippingAddress: {
        id: string;
        unit: number | null;
        streetNumber: number;
        streetName: string;
        streetType: string;
        suburb: string;
        state: State;
        country: string;
        postCode: number;
    } | null;
  }

export async function getSectionEventsAndPrizes(sectionId: string){
  const sectionEvents = await prisma.event.findMany({
    where: {
      sectionId: sectionId
    },
    include: {
      prizes: true
    }
  })
  return sectionEvents
}

export async function getSectionEvents(sectionId: string){
  const sectionEvents = await prisma.event.findMany({
    where: {
      sectionId: sectionId
    }
  })
  return sectionEvents
}

export async function getSectionEventsbySectionName(sectionName: string): Promise<Event[]>{
  const sectionEvents = await prisma.event.findMany({
    where: {
      section: {
          name: sectionName
        }
      }
  })
  return sectionEvents
}

export async function getValidMembershipPackages(): Promise<MembershipPackage[]>{
  const today = new Date()
  const membershipPackages = await prisma.membershipPackage.findMany({
    where: {
      validTo: {
        gte: today
      },
      validFrom: {
        lte: today
      }
    }
  })
  console.log(membershipPackages)
  return membershipPackages
}

export async function getAllMemberships(): Promise<GetAllMemberShipsResult>{
  const memberships = await prisma.membership.findMany({
    include: {
      member: true
    }
  })
  return memberships
}


export type GetAllMemberShipsResult = ({member: User} & Membership)[]
