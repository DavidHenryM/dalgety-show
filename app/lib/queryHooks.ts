'use client'

import { useEffect, useState } from "react"
import { getAllMemberships, GetAllMemberShipsResult, getSponsors, getSponsorshipPackages, getUserRole, getUsersWithRole, getShow, getEvents, getEventSections, getSchedule, getActivities, getMembershipPackages, getStallApplications } from "./queries"
import { Role } from "@generated/enums"
import type { SponsorshipPackage, Event, EventSection, Schedule, Activity, MembershipPackage } from "@generated/browser"
import { sleep } from "../utils"
import { authClient } from "./auth-client"
import { Sponsor, UserReturn } from "../types"
  
  export function useUserRole(): [Role | undefined, boolean] {
    const [userRole, setUserRole] = useState<Role | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const session = authClient.useSession()
    
    useEffect(() => {
      async function getRole(){
        if(session.data){
          if (session.data.user){
            if (session.data.user.email){
              return getUserRole(session.data.user.email).then((role)=>{
                return role
              })
            }
          }
        }
      }
      getRole().then((role)=>{
        if(role){
          setUserRole(role)
        }
      }).then(()=>{
        sleep(3000).then(()=>{
          setLoading(false)
        })
      })
    },[session.data])
    return [userRole, loading]
}

  export function useUsersWithRole(role: Role, refreshKey: number = 0): [Partial<UserReturn>[], boolean] {
    const [users, setUsers] = useState<Partial<UserReturn>[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
      async function getUsers(){
        if(role){
          getUsersWithRole(role).then((users)=>{
            setUsers(users)
            setLoading(false)
          })
        } else {
          setLoading(false)
        }
      }
    getUsers()
    },[role, refreshKey])
    return [users, loading]
}

  export function useSponsors(showYear: number): [Partial<Sponsor>[], boolean] {
    const [sponsors, setSponsors] = useState<Partial<Sponsor>[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
      async function getSponsorships(){
        getSponsors(showYear).then((sponsor)=>{
          setSponsors(sponsor)
          setLoading(false)
        })
      }
    getSponsorships()
    },[showYear])
    return [sponsors, loading]
}

  export function useMemberships():[GetAllMemberShipsResult, boolean]{
    const [members, setMembers] = useState<GetAllMemberShipsResult>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
      async function getMembers(){
        getAllMemberships().then((memberships)=>{
          setMembers(memberships)
          setLoading(false)
        })
      }
    getMembers()
    },[])
    return [members, loading]
  }

  export function useStallApplications(refreshKey: number = 0): [Awaited<ReturnType<typeof getStallApplications>>, boolean] {
    const [applications, setApplications] = useState<Awaited<ReturnType<typeof getStallApplications>>>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
      async function getApps(){
        getStallApplications().then((items)=>{
          setApplications(items)
          setLoading(false)
        })
      }
      getApps()
    },[refreshKey])
    return [applications, loading]
  }

  export function useSponsorshipPackages(refreshKey: number = 0): [Partial<SponsorshipPackage>[], boolean] {
    const [packs, setPacks] = useState<Partial<SponsorshipPackage>[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
      async function getSponsorshipPacks(){
        getSponsorshipPackages().then((packs)=>{
          setPacks(packs)
          setLoading(false)
        })
      }
    getSponsorshipPacks()
    },[refreshKey])
    return [packs, loading]
}

  export function useMembershipPackages(refreshKey: number = 0): [MembershipPackage[], boolean] {
    const [packages, setPackages] = useState<MembershipPackage[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
      async function getPackages(){
        setLoading(true)
        const packs = await getMembershipPackages()
        setPackages(packs)
        setLoading(false)
      }
      getPackages()
    }, [refreshKey])
    return [packages, loading]
  }

export function useEvents(showYear: number, refreshKey: number = 0): [Event[], boolean] {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    async function getShowEvents(){
      setLoading(true)
      if (!showYear) {
        setLoading(false)
        return
      }
      const show = await getShow(showYear)
      if (show){
        const evs = await getEvents(show.id)
        setEvents(evs)
      }
      setLoading(false)
    }
    getShowEvents()
  },[showYear, refreshKey])
  return [events, loading]
}

export function useEventSections(showYear: number, refreshKey: number = 0): [EventSection[], boolean] {
  const [sections, setSections] = useState<EventSection[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    async function getShowSections(){
      setLoading(true)
      if (!showYear) {
        setLoading(false)
        return
      }
      const show = await getShow(showYear)
      if (show){
        const secs = await getEventSections(show.id)
        setSections(secs)
      }
      setLoading(false)
    }
    getShowSections()
  },[showYear, refreshKey])
  return [sections, loading]
}

export function useSchedule(showYear: number, refreshKey: number = 0): [Schedule | undefined, Activity[], boolean] {
  const [schedule, setSchedule] = useState<Schedule>()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    async function getShowSchedule(){
      setLoading(true)
      if (!showYear) {
        throw new Error("No show year provided")
      }
      const show = await getShow(showYear)
      if (show){
        try {
          getSchedule(show.id).then((newSchedule)=>{
            setSchedule(newSchedule)
            console.log("Schedule fetched:", newSchedule)
            return newSchedule
          }).then((newSchedule)=>{
            getActivities(newSchedule.id).then((newActivities)=>{
              setActivities(newActivities)
              console.log("Activities fetched:", newActivities)
            })
          })
          
          
        } catch (error) {
          throw new Error("No schedule found for this show: " + error)
        }
      }
    }

    getShowSchedule().finally(()=>{
      setLoading(false)
    })

  },[showYear, refreshKey])

  return [schedule, activities, loading]
}