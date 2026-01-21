import { SignupFormSchema, FormState } from '../lib/definitions'
import { authClient } from "@lib/auth-client"
import { z } from 'better-auth'


export async function signIn(state: FormState, formData: FormData, callbackURL="/home") : Promise<FormState> {
  // 1. Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as { name?: string[]; email?: string[]; password?: string[] },
    }
  }
 
  // 2. Prepare data for insertion into databaseserver signup
  
  const { name, email } = validatedFields.data
 
  // 3. Insert the user into the database or call an Auth Library's API
  const { data, error } = await authClient.signIn.magicLink({
    email: email, // required
    name: name ?? null,
    callbackURL: callbackURL,
    newUserCallbackURL: "/welcome",
    errorCallbackURL: "/error",
  });

  if (error) {
    const message = typeof error === 'string' ? error : error.message || 'An unknown error occurred'   
  }
  return {
    message: 'Magic link sent! Please check your email to sign in.'
  } as FormState


 
  // TODO:
  // 4. Create user session
  // 5. Redirect user
}