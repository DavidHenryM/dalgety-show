import NextAuth from "next-auth"
import Nodemailer from "next-auth/providers/nodemailer"
import { prisma } from "./lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        },
      },
      from: process.env.EMAIL_FROM,
    })]
})

