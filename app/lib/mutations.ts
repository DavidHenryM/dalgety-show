'use server'

import { EventSection } from "../generated/prisma/client";
import { MembershipType, Role, OfficialRole, State, SponsorshipPackageTier } from "../generated/prisma/enums";
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

type AddressInput = {
  unit?: number | null
  streetNumber: number
  streetName: string
  streetType: string
  suburb: string
  state: State
  country: string
  postCode: number
}

function hasCompleteAddress(address?: Partial<AddressInput> | null): address is AddressInput {
  if (!address) return false
  return (
    typeof address.streetNumber === 'number' &&
    !!address.streetName &&
    !!address.streetType &&
    !!address.suburb &&
    !!address.state &&
    !!address.country &&
    typeof address.postCode === 'number'
  )
}

export async function createUser(data: {
  email: string
  name: string
  firstName?: string | null
  lastName?: string | null
  role: Role
  officialRole?: OfficialRole | null
  mobileNumber?: string | null
  landlineNumber?: string | null
  billingAddress?: Partial<AddressInput> | null
  shippingAddress?: Partial<AddressInput> | null
}) {
  const billing = hasCompleteAddress(data.billingAddress) ? { create: data.billingAddress } : undefined
  const shipping = hasCompleteAddress(data.shippingAddress) ? { create: data.shippingAddress } : undefined
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      role: data.role,
      officialRole: data.officialRole ?? null,
      mobileNumber: data.mobileNumber ?? null,
      landlineNumber: data.landlineNumber ?? null,
      billingAddress: billing,
      shippingAddress: shipping
    }
  })
  return user
}

export async function updateUserRole(id: string, role: Role, officialRole?: OfficialRole | null){
  const user = await prisma.user.update({
    where: { id },
    data: { role, officialRole: officialRole ?? null }
  })
  return user
}

export async function updateUser(id: string, data: Partial<{
  email: string
  name: string
  firstName: string | null
  lastName: string | null
  role: Role
  officialRole: OfficialRole | null
  mobileNumber: string | null
  landlineNumber: string | null
  billingAddress: Partial<AddressInput> | null
  shippingAddress: Partial<AddressInput> | null
}>) {
  const updateData: Record<string, unknown> = {
    email: data.email,
    name: data.name,
    firstName: data.firstName ?? null,
    lastName: data.lastName ?? null,
    role: data.role,
    officialRole: data.officialRole ?? null,
    mobileNumber: data.mobileNumber ?? null,
    landlineNumber: data.landlineNumber ?? null
  }
  if (hasCompleteAddress(data.billingAddress)) {
    updateData.billingAddress = {
      upsert: {
        update: data.billingAddress,
        create: data.billingAddress
      }
    }
  }
  if (hasCompleteAddress(data.shippingAddress)) {
    updateData.shippingAddress = {
      upsert: {
        update: data.shippingAddress,
        create: data.shippingAddress
      }
    }
  }
  const user = await prisma.user.update({
    where: { id },
    data: updateData
  })
  return user
}

export async function deleteUser(id: string){
  const user = await prisma.user.delete({
    where: { id }
  })
  return user
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

export async function createMembershipPackage(data: {
  type: MembershipType
  cost: number
  validFrom: Date
  validTo?: Date | null
  termDays: number
}){
  const membershipPackage = await prisma.membershipPackage.create({
    data
  })
  return membershipPackage
}

export async function updateMembershipPackage(id: string, data: Partial<{
  type: MembershipType
  cost: number
  validFrom: Date
  validTo?: Date | null
  termDays: number
}>) {
  const membershipPackage = await prisma.membershipPackage.update({
    where: { id },
    data
  })
  return membershipPackage
}

export async function deleteMembershipPackage(id: string){
  const membershipPackage = await prisma.membershipPackage.delete({
    where: { id }
  })
  return membershipPackage
}

export async function createSponsorshipPackage(data: {
  tier: string
  minimumAmount: number
  maximumAmount: number
}){
  const sponsorshipPackage = await prisma.sponsorshipPackage.create({
    data: {
      ...data,
      tier: data.tier as SponsorshipPackageTier,
    }
  })
  return sponsorshipPackage
}

export async function updateSponsorshipPackage(id: string, data: Partial<{
  tier: string
  minimumAmount: number
  maximumAmount: number
}>) {
  const sponsorshipPackage = await prisma.sponsorshipPackage.update({
    where: { id },
    data: {
      ...data,
      tier: data.tier as SponsorshipPackageTier,
    }
  })
  return sponsorshipPackage
}

export async function deleteSponsorshipPackage(id: string){
  const sponsorshipPackage = await prisma.sponsorshipPackage.delete({
    where: { id }
  })
  return sponsorshipPackage
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