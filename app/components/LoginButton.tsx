
import { signIn } from "../auth"
import { serverSignIn } from "../serverSignIn"
 
export function LoginButton() {
  return (
    <form
      action={async (formData) => {
        serverSignIn()
        
      }}
    >
      <input type="text" name="email" placeholder="Email" />
      <button type="submit">Signin with Sendgrid</button>
    </form>
  )
}