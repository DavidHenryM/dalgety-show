import { createAuthClient } from "better-auth/react"
import { emailOTPClient, magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
      emailOTPClient(),
      magicLinkClient()
  ]
})