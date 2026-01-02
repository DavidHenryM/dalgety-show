"use client"

import { redirect } from "next/navigation"
import { signIn, auth, providerMap } from "../auth"
import { AuthError } from "next-auth"
import { SetStateAction, useState } from "react"
import { Button, Grid, Paper, TextField } from "@mui/material"
import { serverSignIn } from "../serverSignInOut"
import { drawerWidth, footerHeight } from "../settings"

 
const SIGNIN_ERROR_URL = "/error"
 
export default function SignInPage() {
  
  const [email, setEmail] = useState("")
  
  const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
    setEmail(event.target.value)
  }

  return (
    <Grid container>
      <Grid size={6} justifyItems="center">
        <Paper
              sx={{
                ml: {
                  sm: drawerWidth.sm,
                  md: drawerWidth.md,
                  lg: drawerWidth.lg
                },
                mb: footerHeight
              }}>
          <TextField value={email} onChange={handleChange}/>
          <Button onClick={() => serverSignIn()}>Sign In</Button>
        </Paper>
      </Grid>
    </Grid>
  )
}
  
  