'use client'

import { Grid } from "@mui/material"
import UnAuthorised from "../components/UnAuthorised"
import { useUserRole } from "../lib/queryHooks"
import { drawerWidth, footerHeight } from "../settings"
import { Background } from "../components/Background"
import { getNextShowDate } from "../utils"
import { backgroundImages } from "../images/backgrounds"
import Loading from "../Loading"
import { UsersRoleTable } from "../components/UsersRoleTable"
import { SponsorsTable } from "../components/SponsorsTable"
import Waiting from "../components/Waiting"
import { MembershipsTable } from "../components/MembershipsTable"

export default function Admin(){
  const [role, roleLoading] = useUserRole()

  if (roleLoading){
    return (
      <Waiting message="Authorising..." open={roleLoading}/>
    )
  } else {
    if (role === "SITE_ADMIN" || role === "OWNER"){
      return (
        <>
          <Background image={backgroundImages[1]} />
          <Grid 
            container 
            spacing={2} 
            sx={{
              p: {
                sm: 1, 
                md: 2, 
                lg: 10
              }, 
              ml: {
                sm: drawerWidth.sm,
                md: drawerWidth.md,
                lg: drawerWidth.lg
              },
              mb: footerHeight
            }}
          >
            <UsersRoleTable title={"Users"} role="USER"/>
            <UsersRoleTable title={"Owners"} role="OWNER"/>
            <UsersRoleTable title={"Admins"} role="SITE_ADMIN"/>
            <SponsorsTable title={`Sponsors ${getNextShowDate().getFullYear()}`} showYear={getNextShowDate().getFullYear()}/>
            <MembershipsTable title={"Memberships"}/>
          </Grid>
        </>
      )
    } else {
      return (<UnAuthorised/>)
    }
  }
}