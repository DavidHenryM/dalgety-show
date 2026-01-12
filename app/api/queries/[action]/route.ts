import { NextRequest, NextResponse } from 'next/server'
import {
  getUserRole,
  getUsersWithRole,
  getUserFromEmail,
  getSponsors,
  getMemberships,
  getSponsorshipPackages,
  getShow,
  getOrganisation,
  getEvents,
  getEventSections,
  getEventSectionByName,
  getOrganisations,
  getSectionEventsAndPrizes,
  getSectionEvents,
  getSectionEventsbySectionName,
  getValidMembershipPackages,
  getAllMemberships,
  createEvent,
  updateEvent,
  deleteEvent
} from '../../../lib/queries'
import { auth } from '../../../auth'

export async function GET(req: NextRequest, context: any){
  try{
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params
    const action = params?.action
    const session = await auth()
    if (!session?.user?.email){
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    }
    const url = new URL(req.url)
    const qp = url.searchParams

    switch(action){
      case 'getUserRole':{
        const email = qp.get('email') || ''
        const r = await getUserRole(email)
        return NextResponse.json(r)
      }
      case 'getUsersWithRole':{
        const role = qp.get('role') || undefined
        const r = await getUsersWithRole(role as any)
        return NextResponse.json(r)
      }
      case 'getUserFromEmail':{
        const email = qp.get('email') || ''
        const r = await getUserFromEmail(email)
        return NextResponse.json(r)
      }
      case 'getSponsors':{
        const year = Number(qp.get('showYear'))
        const r = await getSponsors(year)
        return NextResponse.json(r)
      }
      case 'getMemberships':{
        const r = await getMemberships()
        return NextResponse.json(r)
      }
      case 'getSponsorshipPackages':{
        const r = await getSponsorshipPackages()
        return NextResponse.json(r)
      }
      case 'getShow':{
        const year = Number(qp.get('year'))
        const r = await getShow(year)
        return NextResponse.json(r)
      }
      case 'getOrganisation':{
        const name = qp.get('name') || ''
        const contactPersonId = qp.get('contactPersonId') || ''
        const r = await getOrganisation(name, contactPersonId)
        return NextResponse.json(r)
      }
      case 'getEvents':{
        const showId = qp.get('showId') || ''
        const r = await getEvents(showId)
        return NextResponse.json(r)
      }
      case 'getEventSections':{
        const showId = qp.get('showId') || ''
        const r = await getEventSections(showId)
        return NextResponse.json(r)
      }
      case 'getEventSectionByName':{
        const name = qp.get('name') || ''
        const showId = qp.get('showId') || ''
        const r = await getEventSectionByName(name, showId)
        return NextResponse.json(r)
      }
      case 'getOrganisations':{
        const contactPersonId = qp.get('contactPersonId') || ''
        const r = await getOrganisations(contactPersonId)
        return NextResponse.json(r)
      }
      case 'getSectionEventsAndPrizes':{
        const sectionId = qp.get('sectionId') || ''
        const r = await getSectionEventsAndPrizes(sectionId)
        return NextResponse.json(r)
      }
      case 'getSectionEvents':{
        const sectionId = qp.get('sectionId') || ''
        const r = await getSectionEvents(sectionId)
        return NextResponse.json(r)
      }
      case 'getSectionEventsbySectionName':{
        const sectionName = qp.get('sectionName') || ''
        const r = await getSectionEventsbySectionName(sectionName)
        return NextResponse.json(r)
      }
      case 'getValidMembershipPackages':{
        const r = await getValidMembershipPackages()
        return NextResponse.json(r)
      }
      case 'getAllMemberships':{
        const r = await getAllMemberships()
        return NextResponse.json(r)
      }
      default:
        return NextResponse.json({ error: 'unknown action' }, { status: 400 })
    }

  } catch (err:any){
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest, context: any){
  try{
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params
    const action = params?.action
    const session = await auth()
    if (!session?.user?.email){
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    }
    const callerRole = await getUserRole(session.user.email)
    if (!(callerRole === 'SITE_ADMIN' || callerRole === 'OWNER')){
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    const body = await req.json()

    switch(action){
      case 'createEvent':{
        const r = await createEvent(body)
        return NextResponse.json(r)
      }
      case 'updateEvent':{
        const { id, data } = body
        if (!id) return NextResponse.json({ error: 'no id' }, { status: 400 })
        const r = await updateEvent(id, data)
        return NextResponse.json(r)
      }
      default:
        return NextResponse.json({ error: 'unknown action' }, { status: 400 })
    }
  } catch (err:any){
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: any){
  try{
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params
    const action = params?.action
    const session = await auth()
    if (!session?.user?.email){
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    }
    const callerRole = await getUserRole(session.user.email)
    if (!(callerRole === 'SITE_ADMIN' || callerRole === 'OWNER')){
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    const url = new URL(req.url)
    const qp = url.searchParams

    if (action === 'deleteEvent'){
      const id = qp.get('id') || ''
      if (!id) return NextResponse.json({ error: 'no id' }, { status: 400 })
      const r = await deleteEvent(id)
      return NextResponse.json(r)
    }
    return NextResponse.json({ error: 'unknown action' }, { status: 400 })
  } catch (err:any){
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
