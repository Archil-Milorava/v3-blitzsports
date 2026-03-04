'use server'

import { db } from '@/src/drizzle'
import { users } from '@/src/drizzle/schema'
import { setAuthCookies } from '@/src/lib/auth/authCookies'
import { createAccessToken, createRefreshToken } from '@/src/lib/auth/authTokens'
import { decodePasswords } from '@/src/lib/auth/decodePasswords'
import { hashPassword } from '@/src/lib/auth/hashPassword'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  console.log(formData)

  if (!email || !password || !name) throw new Error('გთხოვთ შეიყვანოთ საჭირო ინფორმაცია')

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  const nameTaken = await db.query.users.findFirst({
    where: eq(users.name, name),
  })

  if (existingUser || nameTaken) throw new Error('შეუძლებელია ანგარიშის რეგისტრაცია')

  const hashedPassword = await hashPassword(password)

  await db.insert(users).values({
    name,
    displayName: name,
    email,
    password: hashedPassword,
  })

  return {
    status: 'success',
    message: 'user registred successfully',
  }
}

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) throw new Error('გთხოვთ შეიყვანოთ საჭირო ინფორმაცია')

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!existingUser) throw new Error('შეუძლებელია შესვლა')

  const isPasswordValid = await decodePasswords(password, existingUser.password as string)

  if (!isPasswordValid) throw new Error('შეუძლებელია შესვლა')

  const access = await createAccessToken(existingUser.id)
  const refresh = await createRefreshToken(existingUser.id)

  await setAuthCookies(access, refresh)
}

export const getSession = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')

  if (!token) return null
  console.log(token)
}
