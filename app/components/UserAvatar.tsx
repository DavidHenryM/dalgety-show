'use client'

import { Alert, Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { SignInButton, SignOutButton } from "./SignInOutButton"
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import type { Address, User } from "../generated/prisma/browser"
import { GetOrganisationsResult, getOrganisations, getUserFromEmail } from "../lib/queries"
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { authClient } from "@lib/auth-client"
import { SessionData } from "../types"
import Waiting from "./Waiting"
import { updateUser } from "../lib/mutations"
 
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
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [mobileNumber, setMobileNumber] = useState<string>("")
    const [landlineNumber, setLandlineNumber] = useState<string>("")
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [statusSeverity, setStatusSeverity] = useState<'success' | 'error'>('success')
    
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

    useEffect(()=>{
      if (user){
        setFirstName(user.firstName ?? "")
        setLastName(user.lastName ?? "")
        setMobileNumber(user.mobileNumber ?? "")
        setLandlineNumber(user.landlineNumber ?? "")
      }
    },[user])

    function resetEdits(){
      if (user){
        setFirstName(user.firstName ?? "")
        setLastName(user.lastName ?? "")
        setMobileNumber(user.mobileNumber ?? "")
        setLandlineNumber(user.landlineNumber ?? "")
      }
    }

    async function handleSave(){
      if (!user){
        return
      }
      setSaving(true)
      setStatusMessage(null)
      try {
        const cleanedFirstName = firstName.trim()
        const cleanedLastName = lastName.trim()
        const cleanedMobile = mobileNumber.trim()
        const cleanedLandline = landlineNumber.trim()
        const updatedUser = await updateUser(user.id, {
          firstName: cleanedFirstName.length > 0 ? cleanedFirstName : null,
          lastName: cleanedLastName.length > 0 ? cleanedLastName : null,
          mobileNumber: cleanedMobile.length > 0 ? cleanedMobile : null,
          landlineNumber: cleanedLandline.length > 0 ? cleanedLandline : null,
        })
        setUser(updatedUser)
        setStatusSeverity('success')
        setStatusMessage('Account information updated.')
        setIsEditing(false)
      } catch (error) {
        setStatusSeverity('error')
        setStatusMessage(error instanceof Error ? error.message : 'Failed to update account information.')
      } finally {
        setSaving(false)
      }
    }

    async function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>){
      const file = event.target.files?.[0]
      if (!file){
        return
      }
      setUploading(true)
      setStatusMessage(null)
      try {
        const form = new FormData()
        form.append('file', file)
        const response = await fetch('/api/account/avatar', {
          method: 'POST',
          body: form,
        })
        if (!response.ok){
          const errorBody = await response.json().catch(()=>({}))
          throw new Error(errorBody.error || 'Failed to upload avatar.')
        }
        const result = await response.json()
        setUser((prev)=> prev ? { ...prev, image: result.url ?? prev.image } : prev)
        setStatusSeverity('success')
        setStatusMessage('Avatar updated.')
      } catch (error) {
        setStatusSeverity('error')
        setStatusMessage(error instanceof Error ? error.message : 'Failed to upload avatar.')
      } finally {
        setUploading(false)
        event.target.value = ''
      }
    }

  return (
    <Drawer 
      open={props.openAccountSettings} 
      onClose={() => props.setOpenAccountSettings(false)}
      anchor="right"

    >
      <Waiting message="Loading account information..." open={loading}/>
      <Waiting message="Saving account information..." open={saving}/>
      <Waiting message="Uploading avatar..." open={uploading}/>
      <Box sx={{ width: 350,}} role="presentation">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{p:2}}>
          <Typography sx={{color: "primary.main"}} align="center" variant="h6">Account Information</Typography>
          <Stack direction="row" spacing={1}>
            <IconButton aria-label="Edit account information" onClick={()=>setIsEditing(true)} disabled={isEditing}>
              <EditIcon/>
            </IconButton>
            <IconButton aria-label="Close account settings" onClick={()=>props.setOpenAccountSettings(false)}>
              <CloseIcon/>
            </IconButton>
          </Stack>
        </Stack>
        <Stack alignItems="center" spacing={1} sx={{px:2, pb:2}}>
          <Avatar
            alt={user?.email ?? 'User avatar'}
            src={user?.image ?? undefined}
            sx={{ width: 72, height: 72 }}
          />
          <Button component="label" variant="contained" size="small" disabled={!isEditing || uploading || loading}>
            Upload avatar
            <input hidden accept="image/*" type="file" onChange={handleAvatarUpload}/>
          </Button>
        </Stack>
        {statusMessage ? (
          <Box sx={{px:2, pb:2}}>
            <Alert severity={statusSeverity}>{statusMessage}</Alert>
          </Box>
        ) : null}
        <List sx={{p:2}}>
          <ListItem>
            <ListItemIcon>
              <PersonIcon/>
            </ListItemIcon>
            <ListItemText>
              <Stack spacing={1}>
                <TextField
                  label="First name"
                  size="small"
                  value={firstName}
                  onChange={(event)=>setFirstName(event.target.value)}
                  fullWidth
                  disabled={!isEditing}
                />
                <TextField
                  label="Last name"
                  size="small"
                  value={lastName}
                  onChange={(event)=>setLastName(event.target.value)}
                  fullWidth
                  disabled={!isEditing}
                />
              </Stack>
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
            <Stack spacing={1}>
              <TextField
                label="Mobile number"
                size="small"
                value={mobileNumber}
                onChange={(event)=>setMobileNumber(event.target.value)}
                fullWidth
                disabled={!isEditing}
              />
              <TextField
                label="Landline number"
                size="small"
                value={landlineNumber}
                onChange={(event)=>setLandlineNumber(event.target.value)}
                fullWidth
                disabled={!isEditing}
              />
            </Stack>
            </ListItemText>
          </ListItem>
          {isEditing ? (
            <ListItem>
              <ListItemText>
                <Stack spacing={1}>
                  <Button variant="contained" fullWidth onClick={handleSave} disabled={saving || uploading || loading}>
                    Save changes
                  </Button>
                  <Button
                    variant="text"
                    fullWidth
                    onClick={()=>{
                      resetEdits()
                      setIsEditing(false)
                    }}
                    disabled={saving || uploading || loading}
                  >
                    Cancel
                  </Button>
                </Stack>
              </ListItemText>
            </ListItem>
          ) : null}
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