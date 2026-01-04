'use server'

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