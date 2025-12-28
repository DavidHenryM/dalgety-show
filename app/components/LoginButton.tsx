
import { Button } from "@mui/material"
import { serverSignIn } from "../serverSignIn"
 
export function LoginButton() {
  return (

      <Button variant="outlined" onClick={serverSignIn}>Sign In</Button>
  )
}