import { cookies } from 'next/headers'

export const setAuthCookies = async (access: string, refresh: string) => {
  const cookieStore = await cookies()

  cookieStore.set('accessToken', access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
    maxAge: 60 * 15,
  })

  cookieStore.set('refreshToken', refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export const clearAuthCookies = async () => {
  const store = await cookies()

  store.delete('accessToken')
  store.delete('refreshToken')
}
