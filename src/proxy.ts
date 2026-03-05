import { NextRequest, NextResponse } from 'next/server'
import { createAccessToken, verifyToken } from './lib/auth/authTokens'

const protectedPages = ['/profile']

export async function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request
  const isProtected = protectedPages.some((page) => nextUrl.pathname.startsWith(page))

  let accessToken = cookies.get('accessToken')?.value
  const refreshToken = cookies.get('refreshToken')?.value

  let response = NextResponse.next()

  let decodedAccess = accessToken ? await verifyToken(accessToken) : null

  if (!decodedAccess && refreshToken) {
    const decodedRefresh = await verifyToken(refreshToken)

    if (decodedRefresh && decodedRefresh.userId) {
      accessToken = await createAccessToken(decodedRefresh.userId as string)
      decodedAccess = await verifyToken(accessToken)

      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('cookie', `accessToken=${accessToken}; refreshToken=${refreshToken}`)

      response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })

      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
        maxAge: 60 * 15, 
      })
    }
  }

  if (isProtected && !decodedAccess) {
    const loginUrl = new URL('/auth', request.url)
    loginUrl.searchParams.set('reason', 'unauthorized')
    loginUrl.searchParams.set('from', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
