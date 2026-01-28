import { prisma } from "@lib/prisma"
import { betterAuth } from "better-auth";
import { sendEmail, EmailOptions } from "./email"
import { magicLink } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  database: prismaAdapter(prisma, {provider: "postgresql"}),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        const options: EmailOptions = {
          to: email,
          subject: "Your Dalgety Show Magic Link",
          text: `Click the link to sign in to the Dalgety Show: ${url}?token=${token}`,
        }
        sendEmail(options)
      }
    })
  ]
})