import { cookies } from 'next/headers'

export const setAuthCookies = async (access: string, refresh: string) => {
  const cookieStore = await cookies()

  cookieStore.set('accessToken', access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
    path: '/',
    maxAge: 60 * 60,
  })

  cookieStore.set('refreshToken', refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export const clearAuthCookies = async () => {
  const store = await cookies()

  store.delete('accessToken')
  store.delete('refreshToken')
}
