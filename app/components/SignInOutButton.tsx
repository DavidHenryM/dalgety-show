
import { Button } from "@mui/material"
import { signIn, signOut } from "@lib/session"
import Link from "next/link"
 
export function SignInButton() {
  return (
    <Link href="/signin">
    <Button 
      variant="outlined" 
      sx={{color: "primary.main", backgroundColor: "secondary.main"}} 
      // onClick={() => signIn(props.email, props.urlCallback)}
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
        variant="outlined" 
        sx={{color: "primary.main", backgroundColor: "secondary.main"}} 
        onClick={handleClick}>
          Sign Out
      </Button>
  )
}