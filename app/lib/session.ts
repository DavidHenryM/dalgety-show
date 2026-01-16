"use client"

import { useEffect, useState } from "react";
import { authClient } from "./auth-client";
import { User } from "../generated/prisma/client";
import { getUserFromId } from "./queries";

export async function signIn(email: string, callbackURL?: string): Promise<{data: any, error: any}> {
  const { data, error } = await authClient.signIn.magicLink({
    email: email,
    callbackURL: callbackURL ?? "/home",
    errorCallbackURL: "/signin-error",
  })
  return {data, error}
}

export async function signOut(): Promise<{data: any, error: any}> {
  const { data, error } = await authClient.signOut()
  return {data, error}
}

export function useSession(): { 
  data: any, 
  error: any, 
  refetch: any, 
  isPending: boolean, 
  isRefetching: boolean 
} {
  const { data, error, refetch, isPending, isRefetching } = authClient.useSession()
  return { data, error, refetch, isPending, isRefetching }
}

export function useUserSession(){
  const { data, error } = useSession()
  const [user, setUser] = useState<User | undefined>(undefined)
  
    useEffect(()=>{
      if (data.session?.userId){
        getUserFromId(data.session.userId).then((user)=>{
          if (user){
            setUser(user)
          }
        }).catch((err)=>{
          console.error("Error fetching user:", err)
        })
      }
    },[])
  return { user, data }
}