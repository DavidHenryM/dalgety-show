'use client'

import { Grid } from "@mui/material"
import UnAuthorised from "../components/UnAuthorised"
import { useEffect, useState } from "react"
import { useUserRole } from "../lib/queryHooks"
import { drawerWidth, footerHeight } from "../settings"
import { Background } from "../components/Background"
import { getNextShow } from "../lib/queries"
import { backgroundImages } from "../images/backgrounds"
import { UsersRoleTable } from "../components/UsersRoleTable"
import { SponsorsTable } from "../components/SponsorsTable"
import Waiting from "../components/Waiting"
import { MembershipsTable } from "../components/MembershipsTable"

export default function Admin(){
  const [role, roleLoading] = useUserRole()
  const [nextShowYear, setNextShowYear] = useState<number | null>(null)
  const [nextShowLoading, setNextShowLoading] = useState(true)
  useEffect(() => {
    getNextShow().then((show) => {
      setNextShowYear(show?.year ?? null)
    }).finally(() => setNextShowLoading(false))
  }, [])
  if (roleLoading){
    return (
      <Waiting message="Authorising..." open={roleLoading}/>
    )
  } else {
    if (role === "SITE_ADMIN" || role === "OWNER"){
      if (nextShowLoading){
        return (<Waiting message="Loading latest show..." open={nextShowLoading}/>)
      }
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
            <UsersRoleTable title={"Office Bearers"} role="OWNER"/>
            <UsersRoleTable title={"Admins"} role="SITE_ADMIN"/>
            {nextShowYear ? (
              <SponsorsTable title={`Sponsors ${nextShowYear}`} showYear={nextShowYear}/>
            ) : null}
            {/* <EventsTable title={`Events ${getNextShowDate().getFullYear()}`} showYear={getNextShowDate().getFullYear()} /> */}
            <MembershipsTable title={"Memberships"}/>
          </Grid>
        </>
      )
    } else {
      return (<UnAuthorised/>)
    }
  }
}