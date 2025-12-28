'use client'

import { Avatar, Tooltip } from "@mui/material"
import { useSession } from "next-auth/react"
import womanFarmer from "../images/woman-farmer.png"
 
export default function UserAvatar() {
  const { data: session } = useSession()
  console.log(session)
  if (session?.user){
    const tooltip = `${session.user.email} signed in`
    if (session?.user?.image) {
      return (
        <Tooltip title={tooltip}>
          <Avatar alt={`${session.user.email}`} src={`${session.user.image}`}/>
        </Tooltip>
      )
    } else if (session?.user?.name) {
      return (
        <Tooltip title={tooltip}>
          <Avatar {...stringAvatar(`${session.user.name}`)} alt={`${session.user.email}`}/>
        </Tooltip>
      )
    } else {
      return (
      <Tooltip title={tooltip}>
        <Avatar {...emailAvatar(`${session.user.email}`)} alt={`${session.user.email}`}></Avatar>
      </Tooltip>
      )
    }
  } else{
    return(<></>)
  }
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

function emailAvatar(email: string) {
  const emailName = email.split('@')[0]
  let initials = emailName[0]
  let emailNames = emailName.split('_')
  if (emailNames.length == 1){
    emailNames = emailName.split('.')
  }

  if (emailNames.length >= 1){
    initials = [initials, emailNames[1][0]].join("")
  }
  console.log(initials)
  return {
    sx: {
      bgcolor: stringToColor(initials),
    },
    children: initials,
  }
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}