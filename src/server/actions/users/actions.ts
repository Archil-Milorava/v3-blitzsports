'use server'

import { auth } from '@/src/lib/auth'
import { db } from '@/src/drizzle'
import { users } from '@/src/drizzle/schema'
import { count, desc, eq, ilike, or } from 'drizzle-orm'
import { headers } from 'next/headers'
import z from 'zod'

const ROWS_PER_PAGE = 10

function sanitizeIlikeTerm(raw: string) {
  return raw.trim().replace(/[%_\\]/g, '')
}

const roleSchema = z.enum(['admin', 'writer', 'user'])

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('არასაკმარისი უფლებები')
  }
  return session.user
}

export type AdminUserRow = {
  id: string
  name: string
  displayName: string | null
  email: string
  image: string | null
  role: 'admin' | 'writer' | 'user'
  emailVerified: boolean
  canEditUser: boolean
  canMakeArticle: boolean
  canMakeCard: boolean
  createdAt: Date
}

export async function getUsersPaginated(page: number = 1, search: string = '') {
  await requireAdmin()

  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * ROWS_PER_PAGE
  const term = sanitizeIlikeTerm(search)
  const q = term ? `%${term}%` : null

  const rows = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      displayName: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      canEditUser: true,
      canMakeArticle: true,
      canMakeCard: true,
      createdAt: true,
    },
    ...(q
      ? {
          where: (u, { or, ilike }) =>
            or(ilike(u.name, q), ilike(u.email, q), ilike(u.displayName, q)),
        }
      : {}),
    orderBy: [desc(users.createdAt)],
    limit: ROWS_PER_PAGE,
    offset,
  })

  const countBase = db.select({ total: count() }).from(users)
  const [totalResult] = await (q
    ? countBase.where(or(ilike(users.name, q), ilike(users.email, q), ilike(users.displayName, q)))
    : countBase)

  return {
    users: rows as AdminUserRow[],
    totalPages: Math.max(1, Math.ceil(totalResult.total / ROWS_PER_PAGE)),
    currentPage: safePage,
  }
}

export async function adminDeleteUser(targetUserId: string) {
  const admin = await requireAdmin()

  if (!targetUserId) {
    throw new Error('მომხმარებელი არ არის მითითებული')
  }

  if (targetUserId === admin.id) {
    throw new Error('საკუთარი ანგარიშის წაშლა არ არის ნებადართული')
  }

  const deleted = await db.delete(users).where(eq(users.id, targetUserId)).returning({ id: users.id })

  if (!deleted.length) {
    throw new Error('მომხმარებელი ვერ მოიძებნა')
  }

  return { ok: true as const }
}

export async function adminUpdateUserRole(targetUserId: string, role: string) {
  const admin = await requireAdmin()

  const parsed = roleSchema.safeParse(role)
  if (!parsed.success) {
    throw new Error('არასწორი როლი')
  }

  if (!targetUserId) {
    throw new Error('მომხმარებელი არ არის მითითებული')
  }

  if (targetUserId === admin.id && parsed.data !== 'admin') {
    throw new Error('საკუთარი ადმინისტრატორის უფლების მოხსნა არ არის ნებადართული')
  }

  const updated = await db
    .update(users)
    .set({
      role: parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, targetUserId))
    .returning({ id: users.id })

  if (!updated.length) {
    throw new Error('მომხმარებელი ვერ მოიძებნა')
  }

  return { ok: true as const, role: parsed.data }
}
