import { z } from 'zod'

export const UserSchema = z.object({
  username: z
    .string({
      invalid_type_error: 'username must be a string',
      required_error: 'username is required.'
    })
    .min(4, { message: 'username must be at least 4 characters long' }),
  password: z.string({
    invalid_type_error: 'password must be a string',
    required_error: 'password is required.'
  }),
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.')
})

export function validateUser(user) {
  return UserSchema.safeParse(user)
}

export function validatePartialUser(user) {
  return UserSchema.partial().safeParse(user)
}
