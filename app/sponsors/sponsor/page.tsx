'use client'

import { Background } from "@components/Background";
import { SponsorTheShowForm } from "@components/SponsorTheShowForm";
import Waiting from "@components/Waiting";
import { backgroundImages } from "@app/images/backgrounds";
import { signIn } from "@lib/session";
import { drawerWidth, footerHeight } from "@app/settings";
import { Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import { authClient } from "@/app/lib/auth-client";

export default function SponsorTheShow(){
 const session = authClient.useSession()

  useEffect(()=>{
    if (session.data?.user.email){
      signIn(session.data.user.email, '/sponsors/sponsor').catch((err)=>{
        console.error("Error during sign-in:", err)
      })    
    }
  },[session.data])
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
            <Waiting message="loading" open={session.isPending || session.isRefetching}/>
            <SponsorTheShowForm email={session.data?.user.email}/>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
