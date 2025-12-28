'use client'

import { Avatar } from "@mui/material"
import { auth } from "../auth"
 
export default async function UserAvatar() {
  const session = await auth()
 
  if (!session?.user) return (<Avatar></Avatar>)
 
  return (
    <Avatar src={`${session.user.image}`}></Avatar>
  )
}