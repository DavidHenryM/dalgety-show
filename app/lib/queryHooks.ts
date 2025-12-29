'use client'

import { useEffect, useState } from "react"
import { getSponsors, getSponsorshipPackages, getUserRole, getUsersWithRole } from "./queries"
import { Role } from "../generated/prisma/enums"
import { useSession } from "next-auth/react"
import { Sponsorship, SponsorshipPackage, User } from "../generated/prisma/client"

  
  export function useUserRole(): [Role | undefined, boolean] {
    const [userRole, setUserRole] = useState<Role | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const { data: session } = useSession()
    useEffect(() => {
      async function getRole(){
        if(session){
          if (session.user){
            if (session.user.email){
              getUserRole(session.user.email).then((role)=>{
                console.log(role)
                setUserRole(role)
                setLoading(false)
              })
            }
          }
        }
        setLoading(false)
      }
    getRole()
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
            console.log(users)
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