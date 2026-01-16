"use client"

import Content from "@components/Content";
import { MembershipForm } from "@components/MembershipForm";
import { useSession } from "@lib/session";
import { serverSignIn } from "@app/serverSignInOut";
import { useEffect } from "react";


export default function MembershipApply(){
    const { data: session } = useSession()
    useEffect(()=>{
      if (session?.status === "unauthenticated"){
        serverSignIn()
      }
    },[session])

  return (
    <Content backgroundImageIndex={1}>
      <MembershipForm email={session?.user?.email}/>
    </Content>

  )
}