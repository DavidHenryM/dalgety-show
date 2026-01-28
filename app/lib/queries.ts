'use server'

import { EventSection, Membership, Show, SponsorshipPackage, User, Event, MembershipPackage, Schedule, Activity } from "../generated/prisma/client";
import { Role, State } from "../generated/prisma/enums";
import { SectionEventandPrizes, Sponsor, UserReturn } from "../types";
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

export async function getUsersWithRole(role: Role): Promise<Partial<UserReturn>[]>{
  const users = await prisma.user.findMany({
    where: {
      role: role,
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      firstName: true,
      lastName: true,
      mobileNumber: true,
      landlineNumber: true,
      billingAddress: true,
      shippingAddress: true,
      organisation: {
        select: {
          name: true
        }
      },
      chiefStewardOfEventSections: {
        select: {
          name: true,
          letter: true
        }
      },
      eventResults: {
        select: {
          id: true,
          eventId: true
        }
      },
      officialRole: true
    },
  })
  return users
}

export type OfficialContactUser = Pick<User, "id" | "name" | "email" | "mobileNumber" | "landlineNumber" | "image" | "officialRole"> & {
  officialRole: NonNullable<User["officialRole"]>
}

export async function getOwnerOfficials(): Promise<User[]> {
  const users = await prisma.user.findMany({
    where: {
      role: Role.OWNER,
      officialRole: {
        not: null,
      },
    },
    orderBy: {
      officialRole: "asc",
    }
  })

  return users
}

export async function getUserFromId(userId: string): Promise<User | null>{
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    }
  })

  return user
}

export async function getUserFromEmail(email: string): Promise<User | null>{
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    }
  })

  return user
}

export async function getSponsors(showYear: number): Promise<Sponsor[]>{
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

export async function getStallSiteCategories(showId: string) {
  const categories = await prisma.stallSiteCategory.findMany({
    where: {
      showId: showId
    },
    select: {
      id: true,
      showId: true,
      name: true,
      description: true,
      sizeWidth: true,
      sizeDepth: true,
      powerSupply: true,
      covered: true,
      basePrice: true
    },
    orderBy: {
      name: 'asc'
    }
  })
  return categories
}

export async function getShow(year: number): Promise<Show | null> {
  const show = await prisma.show.findFirst({
    where: {
      year: year
    }
  })
  return show
}

export async function getNextShow(): Promise<Show | null> {
  const now = new Date()
  const nextShow = await prisma.show.findFirst({
    where: {
      start: {
        gt: now
      }
    },
    orderBy: {
      start: 'asc'
    }
  })
  return nextShow
}

export async function getLastShow(): Promise<Show | null> {
  const now = new Date()
  const lastShow = await prisma.show.findFirst({
    where: {
      start: {
        lte: now
      }
    },
    orderBy: {
      start: 'desc'
    }
  })
  return lastShow
}

export async function getShowOfInterest(): Promise<Show | null> {
  const now = new Date()
  const sixMonthsFromNow = new Date(now)
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)

  const nextShow = await prisma.show.findFirst({
    where: {
      start: {
        gt: now
      }
    },
    orderBy: {
      start: 'asc'
    }
  })

  if (nextShow && nextShow.start <= sixMonthsFromNow) {
    return nextShow
  }

  const lastShow = await prisma.show.findFirst({
    where: {
      start: {
        lte: now
      }
    },
    orderBy: {
      start: 'desc'
    }
  })

  return lastShow ?? nextShow ?? null
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

export async function getSchedule(showId: string): Promise<Schedule> {
  const schedule = prisma.schedule.findFirstOrThrow({
    where: {
      showId: showId
    }
  })
  return schedule
}

export type ReleasedScheduleWithShowYear = {
  id: string
  released: Date | null
  showId: string
  show: {
    year: number
  }
}

export async function getReleasedScheduleForShow(showId: string): Promise<ReleasedScheduleWithShowYear | null> {
  const now = new Date()
  const schedule = await prisma.schedule.findFirst({
    where: {
      showId: showId,
      released: {
        not: null,
        lte: now
      }
    },
    select: {
      id: true,
      released: true,
      showId: true,
      show: {
        select: {
          year: true
        }
      }
    }
  })
  return schedule
}

export async function getLatestReleasedSchedule(): Promise<ReleasedScheduleWithShowYear | null> {
  const now = new Date()
  const schedule = await prisma.schedule.findFirst({
    where: {
      released: {
        lte: now
      }
    },
    orderBy: {
      released: 'desc'
    },
    select: {
      id: true,
      released: true,
      showId: true,
      show: {
        select: {
          year: true
        }
      }
    }
  })
  return schedule
}

export async function getStallInformation(showId: string) {
  const stallInformation = await prisma.stallInformation.findFirst({
    where: {
      showId: showId
    }
  })
  return stallInformation
}

export async function getStallApplications() {
  const applications = await prisma.stallApplication.findMany({
    include: {
      applicant: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      },
      organisation: {
        select: {
          name: true
        }
      },
      stallSiteCategory: {
        select: {
          name: true
        }
      },
      stallSites: {
        select: {
          id: true,
          siteNumber: true,
          applicationId: true,
          siteCategoryId: true
        }
      }
    },
    orderBy: {
      applicationDate: 'desc'
    }
  })
  return applications
}

export async function getStallSitesByCategory(categoryId: string) {
  const stallSites = await prisma.stallSite.findMany({
    where: {
      siteCategoryId: categoryId
    },
    orderBy: {
      siteNumber: 'asc'
    }
  })
  return stallSites
}

export async function getActivities(scheduleId: string): Promise<Activity[]> {
  const activities = prisma.activity.findMany({
    where: {
      scheduleId: scheduleId  
    },
    orderBy: {
      time: 'asc'
    }
  })
  return activities
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

export async function getSectionEventsAndPrizes(sectionId: string): Promise<SectionEventandPrizes[]>{
  const sectionEvents = await prisma.event.findMany({
    where: {
      sectionId: sectionId
    },
    include: {
      prizes: true,
      results: {
        include: {
          prize: true,
          winner: {
            select: {
              firstName: true,
              lastName: true,
              name: true
            }
          }
        }
      }
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

export async function getMembershipPackages(): Promise<MembershipPackage[]> {
  const membershipPackages = await prisma.membershipPackage.findMany({
    orderBy: {
      validFrom: 'desc'
    }
  })
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
