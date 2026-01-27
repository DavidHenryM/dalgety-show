
import { Button } from "@mui/material"
import { signOut } from "@lib/session"
import Link from "next/link"
 
export function SignInButton() {
  return (
    <Link href="/signin">
      <Button 
        variant="contained" 
        sx={{color: "primary.main", backgroundColor: "secondary.main"}} 
      >
        Sign In
      </Button>
    </Link>
  )
}

export function SignOutButton() {
  function handleClick() {
    signOut().then((result)=>{
      console.log(result)
    })
  }
  return (
      <Button 
        variant="contained" 
        sx={{color: "primary.main", backgroundColor: "secondary.main"}} 
        onClick={handleClick}>
          Sign Out
      </Button>
  )
}