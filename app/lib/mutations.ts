'use server'

import { EventSection } from "../generated/prisma/client";
import { MembershipType } from "../generated/prisma/enums";
import { OrganisationCreateInput, SponsorshipCreateInput } from "../generated/prisma/models";
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


export async function createEvent(data: {
  name: string
  description?: string | null
  sectionId: string
  showId: string
  maximumAge?: number | null
  minimumAge?: number | null
  gender?: any
  entryFee?: number | null
  entryFeeTeam?: number | null
}){
  const evt = await prisma.event.create({data})
  return evt
}

export async function updateEvent(id: string, data: Partial<{
  name: string
  description?: string | null
  sectionId: string
  showId: string
  maximumAge?: number | null
  minimumAge?: number | null
  gender?: any
  entryFee?: number | null
  entryFeeTeam?: number | null
}>){
  const evt = await prisma.event.update({
    where: { id },
    data: data as any
  })
  return evt
}

export async function deleteEvent(id: string){
  const evt = await prisma.event.delete({
    where: { id }
  })
  return evt
}

export async function updateEventSection(id: string, data: Partial<EventSection>){
  const eventSection = await prisma.eventSection.update({
    where: {id: id},
    data: data 
  })
  return eventSection
}