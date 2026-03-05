const protectedPages = ['/profile']

export async function proxy() {}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
