import { SignupFormSchema, FormState } from '../lib/definitions'
import  bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

export async function signup(state: FormState, formData: FormData) {
  // 1. Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10)
 
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