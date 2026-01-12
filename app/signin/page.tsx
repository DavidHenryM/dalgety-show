"use client"

import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHorse } from "@fortawesome/free-solid-svg-icons"
import { Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material"
import { serverSignIn } from "../serverSignInOut"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setError(null)
    if (!email || typeof email !== 'string') {
      setError('Enter a valid email')
      return
    }
    try{
      setLoading(true)
      await serverSignIn()
    }catch(err:any){
      setError(err?.message || String(err))
    }finally{
      setLoading(false)
    }
  }

  return (
    <Grid
      container
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Stack direction="column" spacing={2} alignItems="center">
          <FontAwesomeIcon color="currentColor" size="2xl" icon={faHorse} bounce />
          <Typography color="primary" variant="h6">Sign in</Typography>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            disabled={loading}
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
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </Stack>
      </Paper>
    </Grid>
  )
}

