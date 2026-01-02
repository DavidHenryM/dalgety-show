
import { Button } from "@mui/material"
import { serverSignIn, serverSignOut } from "../serverSignInOut"
import { UpdateSession, useSession } from "next-auth/react"
import { Dispatch, SetStateAction } from "react"
import { Session } from "next-auth"
 
export function SignInButton() {
  return (
      <Button variant="outlined" sx={{color: "primary.main", backgroundColor: "secondary.main"}} onClick={serverSignIn}>Sign In</Button>
  )
}

export function SignOutButton(props: {sessionUpdate: UpdateSession}) {
  function handleClick() {
    serverSignOut().then((result)=>{
      console.log(result)
      props.sessionUpdate()
    })
  }
  return (
      <Button variant="outlined" sx={{color: "primary.main", backgroundColor: "secondary.main"}} onClick={handleClick}>Sign Out</Button>
  )
}