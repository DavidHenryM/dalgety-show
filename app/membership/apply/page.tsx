"use client"

import Content from "@components/Content";
import { MembershipForm } from "@components/MembershipForm";
import { signIn, useSession } from "@lib/session";
import { useEffect } from "react";


export default function MembershipApply(){
    const { data: session } = useSession()
    useEffect(()=>{
      if (session?.status === "unauthenticated"){
        signIn(session.user.email).catch((err)=>{
          console.error("Error during sign-in:", err)
        })
      }
    },[session])

  return (
    <Content backgroundImageIndex={1}>
      <MembershipForm email={session?.user?.email}/>
    </Content>

  )
}