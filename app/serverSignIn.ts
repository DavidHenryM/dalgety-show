  "use server"

import { signIn } from "./auth"

export async function serverSignIn(){
    await signIn("noedmailer")
}

