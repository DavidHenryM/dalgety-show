'use client'

import { Background } from "@components/Background";
import { SponsorTheShowForm } from "@components/SponsorTheShowForm";
import Waiting from "@components/Waiting";
import { backgroundImages } from "@app/images/backgrounds";
import { signIn, useSession } from "@lib/session";
import { drawerWidth, footerHeight } from "@app/settings";
import { Grid, Paper } from "@mui/material";
import { useEffect } from "react";

export default function SponsorTheShow(){
  const { data: session } = useSession()
  useEffect(()=>{
    console.log(session)
    if (session?.status === "unauthenticated"){
      signIn(session.user.email, '/sponsors/sponsor').catch((err)=>{
        console.error("Error during sign-in:", err)
      })    
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
        <Grid size={12} spacing={2} p={2} sx={{justifyItems:"center"}}>
          <Paper sx={{p:2}}>
            <Waiting message="loading" open={status === "loading"}/>
            <SponsorTheShowForm email={session?.user?.email}/>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}