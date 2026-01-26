"use client"

import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHorse } from "@fortawesome/free-solid-svg-icons"
import { Button, Grid, Stack, TextField, Typography } from "@mui/material"
import { signIn } from "@lib/session"
import Content from "../components/Content"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const handleSignIn = async () => {
    setError(null)
    if (!email || typeof email !== 'string') {
      setError('Enter a valid email')
      return
    }
    try{
      setLoading(true)
      const {data, error} = await signIn(email)
      if(error?.message){
        throw new Error(error.message)
      }
      if(data?.status){
        setEmailSent(data?.status)
      }
    }catch(err: unknown){
      setError(err instanceof Error ? err.message : String(err))
    }finally{
      setLoading(false)
    }
  }

  return (
    <Content backgroundImageIndex={2}>
      <Grid  size={12} m={2} spacing={2} p={2} sx={{justifySelf:"center", minWidth: 400}}>
      <Stack direction="column" spacing={2} alignItems="center">
        <FontAwesomeIcon color="#28719f" size="2xl" icon={faHorse} bounce={loading} />
        {
          emailSent ? 
          <>
            <Typography color="primary" variant="h6">Check your email</Typography>
            <Typography color="primary" variant="body2">We&apos;ve sent a magic link to {email}.</Typography>
            <Typography color="primary" variant="body2">Click on the link and you&apos;ll be logged in.</Typography>
            <Typography component="button" onClick={()=>setEmailSent(false)} color="primary" variant="caption">Didn&apos;t get the link? Click here to try again.</Typography>
          </>
          :
          <>
          <Typography color="primary" variant="h6">Sign in</Typography>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          disabled={loading || emailSent}
        />
        {error ? (
          <Typography color="error" variant="body2">{error}</Typography>
        ) : null}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignIn}
          disabled={loading}
        >
          <Typography color="secondary">
          {loading ? 'Signing in…' : 'Sign in'}
          </Typography>
        </Button>
        </>
}
      </Stack>
      </Grid>
    </Content>
  )
}

