'use client'

import { Background } from "@/app/components/Background";
import { SponsorTheShowForm } from "@/app/components/SponsorTheShowForm";
import { backgroundImages } from "@/app/images/backgrounds";
import Loading from "@/app/Loading";
import { serverSignIn } from "@/app/serverSignIn";
import { drawerWidth, footerHeight } from "@/app/settings";
import { Grid, Paper } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


export default function SponsorTheShow(){
  const { data: session, status: status } = useSession()
  console.log(session)

  useEffect(()=>{
    console.log(session)
    if (status === "unauthenticated"){
      serverSignIn()
    }
  },[session])

  return (
    <>
      <Background image={backgroundImages[0]} />
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
        <Grid size={12} spacing={2} p={2}>
          <Paper>
            { status === "loading" ? <Loading/> : <SponsorTheShowForm email={session?.user?.email}/>}
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}