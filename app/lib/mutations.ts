'use server'

import { EventSection } from "../generated/prisma/client";
import { MembershipType, Role, OfficialRole, State, SponsorshipPackageTier } from "../generated/prisma/enums";
import { EventCreateInput, EventUpdateInput, OrganisationCreateInput, SponsorshipCreateInput } from "../generated/prisma/models";
import { EventTableForm } from "../types";
import { prisma } from "./prisma";
import { sendEmail } from "./email";

export async function createSponsorship(sponsorshipData: SponsorshipCreateInput){
  const createdSponsorship= await prisma.sponsorship.create({
    data: sponsorshipData
  })
  return createdSponsorship
}

export async function createStallApplication(data: {
  email: string
  organisationName?: string | null
  stallSiteCategoryId: string
  preferredLocation: string
  itemsToBeSoldOrDisplayed: string
  layoutOrSpecialFeatures?: string | null
  stallSetupImageLink?: string | null
  publicLiabilityInsuranceLink?: string | null
  notes?: string | null
}) {
  const applicant = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })
  if (!applicant) {
    throw new Error('Applicant not found')
  }

  const category = await prisma.stallSiteCategory.findUnique({
    where: {
      id: data.stallSiteCategoryId
    }
  })
  if (!category) {
    throw new Error('Stall category not found')
  }

  let organisationId: string | undefined
  const organisationName = data.organisationName?.trim()
  if (organisationName) {
    const existingOrganisation = await prisma.organisation.findUnique({
      where: {
        name: organisationName
      }
    })
    if (existingOrganisation) {
      organisationId = existingOrganisation.id
    } else {
      const createdOrganisation = await prisma.organisation.create({
        data: {
          name: organisationName,
          contactPersonId: applicant.id
        }
      })
      organisationId = createdOrganisation.id
    }
  }

  const stallApplication = await prisma.stallApplication.create({
    data: {
      applicantId: applicant.id,
      organisationId,
      stallSiteCategoryId: data.stallSiteCategoryId,
      preferredLocation: data.preferredLocation,
      itemsToBeSoldOrDisplayed: data.itemsToBeSoldOrDisplayed,
      layoutOrSpecialFeatures: data.layoutOrSpecialFeatures ?? null,
      stallSetupImageLink: data.stallSetupImageLink ?? null,
      publicLiabilityInsuranceLink: data.publicLiabilityInsuranceLink ?? null,
      notes: data.notes ?? null
    }
  })

  return stallApplication
}

export async function updateStallInformation(showId: string, data: {
  welcomeMessage?: string | null
  insuranceDetails?: string | null
  safetyGuidelines?: string | null
  setupInstructions?: string | null
  paymentDetails?: string | null
  cancellationPolicy?: string | null
  siteMap?: string | null
  contactInformation?: string | null
  thankyouMessage?: string | null
}) {
  const stallInformation = await prisma.stallInformation.upsert({
    where: {
      showId: showId
    },
    update: {
      ...data
    },
    create: {
      showId: showId,
      ...data
    }
  })
  return stallInformation
}

export async function createStallSiteCategory(data: {
  showId: string
  name: string
  description?: string | null
  sizeWidth: number
  sizeDepth: number
  powerSupply?: boolean
  covered?: boolean
  basePrice: number
}) {
  const category = await prisma.stallSiteCategory.create({
    data: {
      showId: data.showId,
      name: data.name,
      description: data.description ?? null,
      sizeWidth: data.sizeWidth,
      sizeDepth: data.sizeDepth,
      powerSupply: data.powerSupply ?? false,
      covered: data.covered ?? false,
      basePrice: data.basePrice
    }
  })
  return category
}

export async function updateStallSiteCategory(id: string, data: {
  name: string
  description?: string | null
  sizeWidth: number
  sizeDepth: number
  powerSupply?: boolean
  covered?: boolean
  basePrice: number
}) {
  const category = await prisma.stallSiteCategory.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description ?? null,
      sizeWidth: data.sizeWidth,
      sizeDepth: data.sizeDepth,
      powerSupply: data.powerSupply ?? false,
      covered: data.covered ?? false,
      basePrice: data.basePrice
    }
  })
  return category
}

export async function deleteStallSiteCategory(id: string) {
  const category = await prisma.stallSiteCategory.delete({
    where: { id }
  })
  return category
}

export async function assignStallSiteToApplication(stallSiteId: string, applicationId: string) {
  const stallSite = await prisma.stallSite.update({
    where: { id: stallSiteId },
    data: { applicationId }
  })
  return stallSite
}

export async function emailOfficialRole(options: { role: OfficialRole; subject: string; text: string }) {
  try {
    const recipients = await prisma.user.findMany({
      where: {
        role: Role.OWNER,
        officialRole: options.role
      },
      select: {
        email: true
      }
    })

    const emails = recipients.map((recipient) => recipient.email).filter(Boolean)
    if (emails.length === 0) {
      console.warn("emailOfficialRole: no recipients", {
        role: options.role,
        subject: options.subject
      })
      return { sent: false, recipients: [] as string[] }
    }

    console.info("emailOfficialRole: sending email", {
      role: options.role,
      subject: options.subject,
      recipients: emails
    })

    await sendEmail({
      to: emails.join(', '),
      subject: options.subject,
      text: options.text
    })

    console.info("emailOfficialRole: email sent", {
      role: options.role,
      subject: options.subject,
      recipients: emails
    })

    return { sent: true, recipients: emails }
  } catch (error) {
    console.error("emailOfficialRole: failed to send email", {
      role: options.role,
      subject: options.subject,
      error: error instanceof Error ? error.message : String(error)
    })
    return { sent: false, recipients: [] as string[] }
  }
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