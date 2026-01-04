"use client"

import Content from "@/app/components/Content";
import { MembershipForm } from "@/app/components/MembershipForm";
import { serverSignIn } from "@/app/serverSignInOut";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


export default function MembershipApply(){
    const { data: session, status: status } = useSession()
    useEffect(()=>{
      if (status === "unauthenticated"){
        serverSignIn()
      }
    },[session])

  return (
    <Content backgroundImageIndex={1}>
      <MembershipForm email={session?.user?.email}/>
    </Content>

  )
}