"use client"

import { authClient } from "@lib/auth-client";
import Content from "@components/Content";
import { MembershipForm } from "@components/MembershipForm";
import SignInPage from "@/app/signin/page";
import Waiting from "@/app/components/Waiting";


export default function MembershipApply(){
  const { data, error, refetch, isPending, isRefetching } = authClient.useSession()

  if (!data && !isPending && !isRefetching){
    return (<SignInPage></SignInPage>)
  } 


  return (
    <Content backgroundImageIndex={1}>
      <Waiting message="Loading session..." open={isPending || isRefetching}/>
      <MembershipForm email={data?.user?.email}/>
    </Content>

  )
}