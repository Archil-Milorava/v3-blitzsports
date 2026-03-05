import { db } from '@/src/drizzle'
import { users } from '@/src/drizzle/schema'
import { verifyToken } from '@/src/lib/auth/authTokens'
import { User } from '@/src/types/types'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'


export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) return null

    const decoded = await verifyToken(token)
    if (!decoded || !decoded.userId) return null

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId as string),
      columns: {
        password: false,
      },
    })

    return user || null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}
