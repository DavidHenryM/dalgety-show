import { NextRequest, NextResponse } from 'next/server'
import { headers } from "next/headers"
import {
  getUserRole,
  getUsersWithRole,
  getUserFromEmail,
  getSponsors,
  getMemberships,
  getSponsorshipPackages,
  getShow,
  getShowOfInterest,
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

} from '@lib/queries'
import {
  createEvent,
  updateEvent,
  deleteEvent
} from '@lib/mutations'
import { auth } from '@lib/auth'
import { list, put } from "@vercel/blob";
import { Role } from '@/app/generated/prisma/enums'

export async function GET(request: NextRequest, context: { params: Promise<{ action?: string }> }) {
  try{
    const params = request.nextUrl.searchParams
    const routeParams = await context.params
    const action = routeParams.action || params.get('action')
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session?.user?.email){
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    } else {
      const user = await getUserFromEmail(session.user.email)
      if(user?.role != Role.SITE_ADMIN && user?.role != Role.OWNER){
        return NextResponse.json({ error: 'forbidden' }, { status: 403 })
      }
    }


    switch(action){
      case 'getUserRole':{
        const email = params.get('email') || ''
        const r = await getUserRole(email)
        return NextResponse.json(r)
      }
      case 'getUsersWithRole':{
        const role = params.get('role') || undefined
        if (!role){
          return NextResponse.json({ error: 'no role specified' }, { status: 400 })
        }
        const r = await getUsersWithRole(role as Role)
        return NextResponse.json(r)
      }
      case 'getUserFromEmail':{
        const email = params.get('email') || ''
        const r = await getUserFromEmail(email)
        return NextResponse.json(r)
      }
      case 'getSponsors':{
        const year = Number(params.get('showYear'))
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
        const year = Number(params.get('year'))
        const r = await getShow(year)
        return NextResponse.json(r)
      }
      case 'getShowOfInterest':{
        const r = await getShowOfInterest()
        return NextResponse.json(r)
      }
      case 'getOrganisation':{
        const name = params.get('name') || ''
        const contactPersonId = params.get('contactPersonId') || ''
        const r = await getOrganisation(name, contactPersonId)
        return NextResponse.json(r)
      }
      case 'getEvents':{
        const showId = params.get('showId') || ''
        const r = await getEvents(showId)
        return NextResponse.json(r)
      }
      case 'getEventSections':{
        const showId = params.get('showId') || ''
        const r = await getEventSections(showId)
        return NextResponse.json(r)
      }
      case 'getEventSectionByName':{
        const name = params.get('name') || ''
        const showId = params.get('showId') || ''
        const r = await getEventSectionByName(name, showId)
        return NextResponse.json(r)
      }
      case 'getOrganisations':{
        const contactPersonId = params.get('contactPersonId') || ''
        const r = await getOrganisations(contactPersonId)
        return NextResponse.json(r)
      }
      case 'getSectionEventsAndPrizes':{
        const sectionId = params.get('sectionId') || ''
        const r = await getSectionEventsAndPrizes(sectionId)
        return NextResponse.json(r)
      }
      case 'getSectionEvents':{
        const sectionId = params.get('sectionId') || ''
        const r = await getSectionEvents(sectionId)
        return NextResponse.json(r)
      }
      case 'getSectionEventsbySectionName':{
        const sectionName = params.get('sectionName') || ''
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
      case 'getImages':{ 
        const prefix = params.get('prefix') || ''
        const token = process.env.BLOB_STORE_READ_WRITE_TOKEN
        if (!token) {
          return NextResponse.json({ error: 'missing BLOB_STORE_READ_WRITE_TOKEN' }, { status: 500 })
        }
         try {
          // Optional: Filter by a specific prefix (e.g., 'gallery/')
          const { blobs } = await list({ prefix: prefix, token });

          // Extract only the URLs
          const imageUrls = blobs.map(blob => blob.url);

          return NextResponse.json({ images: imageUrls });
        } catch (error) {
          console.error('Error listing blobs:', error);
          return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
        }
      }
      default:
        return NextResponse.json({ error: 'unknown action' }, { status: 400 })
    }

  } catch (err: { message?: string } | unknown){
    if (err && typeof err === 'object' && 'message' in err) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: NextRequest){
  try{
    const params = request.nextUrl.searchParams
    const action = params.get('action')
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session?.user?.email){
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    }
    const callerRole = await getUserRole(session.user.email)
    if (!(callerRole === 'SITE_ADMIN' || callerRole === 'OWNER')){
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    const body = await request.json()

    switch(action){
      case 'createEvent':{
        const r = await createEvent(body, params.get('showId') || '')
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
  } catch (err: { message?: string } | unknown){
    if (err && typeof err === 'object' && 'message' in err) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest){
  try{
    const params = request.nextUrl.searchParams
    const action = params.get('action')
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session?.user?.email){
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    }
    const callerRole = await getUserRole(session.user.email)
    if (!(callerRole === 'SITE_ADMIN' || callerRole === 'OWNER')){
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    const url = new URL(request.url)
    const qp = url.searchParams

    if (action === 'deleteEvent'){
      const id = qp.get('id') || ''
      if (!id) return NextResponse.json({ error: 'no id' }, { status: 400 })
      const r = await deleteEvent(id)
      return NextResponse.json(r)
    }
    return NextResponse.json({ error: 'unknown action' }, { status: 400 })
 } catch (err: { message?: string } | unknown){
    if (err && typeof err === 'object' && 'message' in err) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ action?: string }> }) {
  try{
    const params = request.nextUrl.searchParams
    const routeParams = await context.params
    const pathAction = request.nextUrl.pathname.split('/').pop()
    const action = routeParams.action || params.get('action') || pathAction
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session?.user?.email){
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    }
    const callerRole = await getUserRole(session.user.email)
    if (!(callerRole === 'SITE_ADMIN' || callerRole === 'OWNER')){
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    switch(action){
      case 'uploadImage':{
        const form = await request.formData();
        const imageFile = form.get('file') as File | null;
        
        if (!imageFile) {
          return NextResponse.json({ error: 'no file provided' }, { status: 400 })
        }
        const year = form.get('year') as string | null;
        if (!year) {
          return NextResponse.json({ error: 'no year provided' }, { status: 400 })
        }
        const token = process.env.BLOB_STORE_READ_WRITE_TOKEN
        if (!token) {
          return NextResponse.json({ error: 'missing BLOB_STORE_READ_WRITE_TOKEN' }, { status: 500 })
        }
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const blob = await put(`images/${year}/gallery/${imageFile.name}`, buffer, {
          contentType: imageFile.type || 'application/octet-stream',
          access: 'public',
          token
        })
        return NextResponse.json(blob);
      }
      default:
        return NextResponse.json({ error: 'unknown action' }, { status: 400 })
    }
   } catch (err: { message?: string } | unknown){
    if (err && typeof err === 'object' && 'message' in err) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }

}
