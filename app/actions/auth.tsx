import { SignupFormSchema, FormState } from '../lib/definitions'
import { prisma } from '../lib/prisma'

export async function signup(state: FormState, formData: FormData) {
  // 1. Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  // 2. Prepare data for insertion into database
  const { name, email } = validatedFields.data
 
  // 3. Insert the user into the database or call an Auth Library's API
  const user = await prisma.user.create({
    data: {
      email: email,
    }
  })
  console.log('Created user:', user)
 

 
  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  } 
 
  // TODO:
  // 4. Create user session
  // 5. Redirect user
}