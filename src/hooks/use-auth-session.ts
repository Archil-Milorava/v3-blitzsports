'use client'

import { authClient } from '@/src/lib/auth-client'

function roleFromSessionUser(role: string | undefined | null) {
  return {
    role: role ?? null,
    isAdmin: role === 'admin',
    isWriter: role === 'writer',
  }
}

/**
 * Subscribes to the Better Auth session (same source as `authClient.useSession`).
 * Prefer this over `getSession` + `useEffect` in client components.
 */
export function useAuthSession() {
  const { data: session, isPending, isRefetching, error, refetch } = authClient.useSession()
  const user = session?.user ?? null
  const { role, isAdmin, isWriter } = roleFromSessionUser(user?.role)

  return {
    user,
    session,
    isPending,
    isRefetching,
    error,
    refetch,
    role,
    isAdmin,
    isWriter,
  }
}

/**
 * Admin role from the live session. If you already call `useAuthSession` in the same
 * component, destructure `isAdmin` from it instead of calling this hook again.
 */
export function useIsAdmin() {
  const { isAdmin } = useAuthSession()
  return isAdmin
}

/** Same as `isWriter` on `useAuthSession`; avoid using both hooks in one component. */
export function useIsWriter() {
  const { isWriter } = useAuthSession()
  return isWriter
}
