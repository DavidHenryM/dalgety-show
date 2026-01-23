'use server'

import { EventSection } from "../generated/prisma/client";
import { MembershipType } from "../generated/prisma/enums";
import { EventCreateInput, EventUpdateInput, OrganisationCreateInput, SponsorshipCreateInput } from "../generated/prisma/models";
import { EventTableForm } from "../types";
import { prisma } from "./prisma";

export async function createSponsorship(sponsorshipData: SponsorshipCreateInput){
  const createdSponsorship= await prisma.sponsorship.create({
    data: sponsorshipData
  })
  return createdSponsorship
}

export async function updateUserName(email: string, firstName: string, lastName: string){
  const updatedUser = await prisma.user.update({
    where: {
      email: email
    },
    data: {
      firstName: firstName,
      lastName: lastName
    }
  })
  return updatedUser
}

export async function createOrganisation(organisationData: OrganisationCreateInput){
  const createdOrganisation = await prisma.organisation.create({
    data: organisationData
  })
  return createdOrganisation
}

export async function createMembership(memberType: MembershipType, cost: number, memberId: string){
  const membership = await prisma.membership.create({
    data: {
      memberId: memberId,
      cost: cost,
      type: memberType,
      applyDate: new Date(),
    }
  })
  return membership
}


export async function createEvent(data: EventTableForm, showId: string){
  if (data.eventName){
    const input: EventCreateInput = {
      name: data.eventName,
      description: data.description,
      section: { connect: { id: data.sectionId } },
      maximumAge: data.maximumAge ? Number(data.maximumAge) : undefined,
      minimumAge: data.minimumAge ? Number(data.minimumAge) : undefined,
      show: {
        connect: { id: showId }
      }
    } 
    const evt = await prisma.event.create({data: input})
    return evt
  } else {
    throw new Error("Event name is required") 
  }
}

export async function updateEvent(data: EventTableForm, eventId: string){
  const input: EventUpdateInput = {
    name: data.eventName,
    description: data.description,
    section: {connect: {id: data.sectionId}},
    maximumAge: data.maximumAge ? Number(data.maximumAge) : undefined,
    minimumAge: data.minimumAge ? Number(data.minimumAge) : undefined,
  } 
  const evt = await prisma.event.update({
    where: { id: eventId },
    data: input
  })
  return evt
}

export async function deleteEvent(id: string){
  const evt = await prisma.event.delete({
    where: { id }
  })
  return evt
}

export async function createPrize(data: {
  eventId: string
  prizeName?: string | null
  cashPrizeValue?: number | null
  trophyName?: string | null
  ribbonName?: string | null
}){
  const prize = await prisma.prize.create({ data })
  return prize
}

export async function updatePrize(id: string, data: Partial<{
  prizeName?: string | null
  cashPrizeValue?: number | null
  trophyName?: string | null
  ribbonName?: string | null
}>){
  const prize = await prisma.prize.update({
    where: { id },
    data: data
  })
  return prize
}

export async function deletePrize(id: string){
  const prize = await prisma.prize.delete({
    where: { id }
  })
  return prize
}

export async function createActivity(data: {
  scheduleId: string
  time: Date
  name: string
  description?: string | null
  link?: string | null
  icon?: string | null
}){
  const activity = await prisma.activity.create({ data })
  return activity
}

export async function updateActivity(id: string, data: Partial<{
  time: Date
  name: string
  description?: string | null
  link?: string | null
  icon?: string | null
}>){
  const activity = await prisma.activity.update({
    where: { id },
    data: data
  })
  return activity
}

export async function deleteActivity(id: string){
  const activity = await prisma.activity.delete({
    where: { id }
  })
  return activity
}

export async function updateSchedule(id: string, data: Partial<{
  released?: Date | null
}>){
  const schedule = await prisma.schedule.update({
    where: { id },
    data: data
  })
  return schedule
}

export async function updateEventSection(id: string, data: Partial<EventSection>){
  const eventSection = await prisma.eventSection.update({
    where: {id: id},
    data: data 
  })
  return eventSection
}