
import { Button } from "@mui/material"
import { serverSignIn } from "../serverSignIn"
 
export function SignInButton() {
  return (

      <Button variant="outlined" sx={{color: "primary.main", backgroundColor: "secondary.main"}} onClick={serverSignIn}>Sign In</Button>
  )
}