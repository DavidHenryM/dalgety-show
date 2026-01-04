'use client'

import { useEffect, useState } from "react"
import { getAllMemberships, GetAllMemberShipsResult, getMemberships, getSponsors, getSponsorshipPackages, getUserRole, getUsersWithRole } from "./queries"
import { Role } from "../generated/prisma/enums"
import { useSession } from "next-auth/react"
import { Membership, Sponsorship, SponsorshipPackage, User } from "../generated/prisma/client"
import { sleep } from "../utils"

  
  export function useUserRole(): [Role | undefined, boolean] {
    const [userRole, setUserRole] = useState<Role | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const { data: session } = useSession()
    useEffect(() => {
      async function getRole(){
        if(session){
          if (session.user){
            if (session.user.email){
              return getUserRole(session.user.email).then((role)=>{
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
    },[session])
    return [userRole, loading]
}

  export function useUsersWithRole(role: Role): [Partial<User>[], boolean] {
    const [users, setUsers] = useState<Partial<User>[]>([])
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
    },[])
    return [users, loading]
}

  export function useSponsors(showYear: number): [any[], boolean] {
    const [sponsors, setSponsors] = useState<Partial<Sponsorship>[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
      async function getSponsorships(){
        getSponsors(showYear).then((sponsor)=>{
          setSponsors(sponsor)
          setLoading(false)
        })
      }
    getSponsorships()
    },[])
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

  export function useSponsorshipPackages(): [any[], boolean] {
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
    },[])
    return [packs, loading]
}