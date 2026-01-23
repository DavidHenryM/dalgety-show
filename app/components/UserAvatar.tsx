'use client'

import { Avatar, Box, Button, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material"
import { SignInButton, SignOutButton } from "./SignInOutButton"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Address, User } from "../generated/prisma/client"
import { GetOrganisationsResult, getOrganisations, getUserFromEmail } from "../lib/queries"
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { authClient } from "@lib/auth-client"
import { SessionData } from "../types"
import Waiting from "./Waiting"
 
export default function UserAvatar() {
  const sessionData = authClient.useSession()
  const [openAccountSettings, setOpenAccountSettings] = useState(false)

  function handleAvatarClick(){
    console.log(openAccountSettings)
    setOpenAccountSettings(!openAccountSettings)
  }

  if (sessionData.data?.user){
    const tooltip = `${sessionData.data.user.email} signed in`
      return (
        <>
          <Tooltip title={tooltip}>
            <Button onClick={handleAvatarClick}>
              <AvatarNamed session={sessionData}/>
            </Button>
          </Tooltip>
          <AccountSettings 
            openAccountSettings={openAccountSettings} 
            setOpenAccountSettings={setOpenAccountSettings} 
            email={sessionData.data.user.email}
          />
        </>
      )
   
  } else {
    return(
    <>
      <SignInButton/>
    </>
    )
  }
}

function AvatarNamed(props: {session: SessionData | null}){
  if (props.session?.data?.user){
    const user = props.session?.data?.user
    if (user.image) {
      return (
        <Avatar alt={`${user.email}`} src={`${user.image}`}/>
      )
    } else if (user.name){
      return (
        <Avatar {...stringAvatar(`${user.name}`)} alt={`${user.email}`}/>
      )
    } else {
       return (
        <Avatar {...emailAvatar(`${user.email}`)} alt={`${user.email}`}></Avatar>
       )
    }             
  } else {
    return (<></>)
  }
}

function AccountSettings(
  props: {
    openAccountSettings: boolean, 
    setOpenAccountSettings: Dispatch<SetStateAction<boolean>>,
    email: string | null | undefined
  }){
    
    const [user, setUser] = useState<User | null>(null)
    const [organisations, setOrganisations] = useState<GetOrganisationsResult[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(()=>{
      async function fetchUserData(){
        if (props.email) {
          setLoading(true)
          getUserFromEmail(props.email).then((user)=>{
            setUser(user)
            if (user) {
              getOrganisations(user.id).then((orgs)=>{
                setOrganisations(orgs)
              })
            }
          }).finally(()=>{
            setLoading(false)
          })
        }
      }
    
      fetchUserData()
    },[props.email])

  return (
    <Drawer 
      open={props.openAccountSettings} 
      onClose={() => props.setOpenAccountSettings(false)}
      anchor="right"

    >
      <Waiting message="Loading account information..." open={loading}/>
      <Box sx={{ width: 350,}} role="presentation" onClick={()=>props.setOpenAccountSettings(false)}>
        <Typography sx={{color: "primary.main", p:2}} align="center" variant="h6">Account Information</Typography>
        <List sx={{p:2}}>
          <ListItem>
            <ListItemIcon>
              <PersonIcon/>
            </ListItemIcon>
            <ListItemText>
              <Typography>{user?.firstName && user?.lastName ? `${user?.firstName} ${user?.lastName}`: "Unknown"}</Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EmailIcon/>
            </ListItemIcon>
            <ListItemText>
              <Typography>{`${user?.email}`}</Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SmartphoneIcon/>
            </ListItemIcon>
            <ListItemText>
            <Typography>{user?.mobileNumber ? user?.mobileNumber : "Unknown"}</Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AdminPanelSettingsIcon/>
            </ListItemIcon>
            <ListItemText>
            <Typography>{user?.role}</Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
            <Typography>{`Account created: ${user?.createdAt.toDateString()}`}</Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
            <Typography>{`Account updated: ${user?.updatedAt.toDateString()}`}</Typography>
            </ListItemText>
          </ListItem>
          <Divider/>
            { organisations.map((oneOrg, index)=>{
              return (
                <div key={`organisation-${index}`}>
                  <ListItem>
                    <Typography variant="h6" sx={{color: "primary.main"}}>{`${oneOrg.name}`}</Typography>
                  </ListItem>
                  <ListItem>
                   <Typography sx={{ whiteSpace: 'pre-line' }}>{`Billing address: \n${formatAddress(oneOrg.billingAddress)}`}</Typography>
                    <Typography></Typography>
                  </ListItem>
                  <ListItem>
                    <Typography sx={{ whiteSpace: 'pre-line' }}>{`Shipping address: \n${formatAddress(oneOrg.shippingAddress)}`}</Typography>
                  </ListItem>
                  <Divider/>
                </div>
              )
            })}
          <ListItem sx={{p:2}} key={"Sign Out"} disablePadding>
            <SignOutButton/>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}

function formatAddress(address: Address | null): string {
  if (address){
    const streetLine = `${address.unit ? `${address.unit}/` : "" + `${address.streetNumber} ${address.streetName} ${address.streetType}`}`
    const townLine = `${address.suburb} ${address.state} ${address.postCode}`
    return [streetLine, townLine, address.country].join("\n")
  } else {
    return "Unknown"
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


  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }


  return color;
}