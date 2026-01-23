"use client"

import { authClient } from "@lib/auth-client";
import Content from "@components/Content";
import { MembershipForm } from "@components/MembershipForm";
import SignInPage from "@/app/signin/page";
import Waiting from "@/app/components/Waiting";


export default function MembershipApply(){
  const session = authClient.useSession()

  if (!session.data && !session.isPending && !session.isRefetching){
    return (<SignInPage></SignInPage>)
  } 


  return (
    <Content backgroundImageIndex={1}>
      <Waiting message="Loading session..." open={session.isPending || session.isRefetching}/>
      <MembershipForm email={session.data?.user?.email}/>
    </Content>

  )
}