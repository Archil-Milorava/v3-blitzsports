'use server'
import cloudinary from '@/src/config/cloudinary'
import { destroyCloudinaryImageByUrl } from '@/src/lib/cloudinary-asset'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/drizzle'
import { article } from '@/src/drizzle/schema'
import { publicUserSelect } from '@/src/drizzle/selects'
import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const ROWS_PER_PAGE = 10

function sanitizeIlikeTerm(raw: string) {
  return raw.trim().replace(/[%_\\]/g, '')
}

async function requireSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    throw new Error('ავტორიზაცია საჭიროა')
  }
  return session.user
}

async function requireAdminUser() {
  const user = await requireSessionUser()
  if (user.role !== 'admin') {
    throw new Error('ადმინისტრატორის უფლება საჭიროა')
  }
  return user
}

export const getLandingNews = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 60000))
  const landingNews = await db.query.article.findMany({
    where: and(eq(article.badge, 'news'), eq(article.softDelete, false)),
    orderBy: [desc(article.createdAt)],
    limit: 6,
  })

  if (!landingNews) throw new Error('Articles not found')

  return landingNews
}

export const getLandingHistories = async () => {
  // await new Promise((res) => setTimeout(res, 15000))
  const landingHistories = await db.query.article.findMany({
    where: and(eq(article.badge, 'history'), eq(article.softDelete, false)),
    orderBy: [desc(article.createdAt)],
    limit: 3,
  })

  if (!landingHistories) throw new Error('Histories not found')

  return landingHistories
}

export const getNewsByCategory = async (category: string, page: number = 1) => {
  const limit = 6
  const offset = (page - 1) * limit

  const articles = await db.query.article.findMany({
    where: (article, { eq, and }) =>
      and(eq(article.category, category), eq(article.softDelete, false)),
    orderBy: (article, { desc }) => [desc(article.createdAt)],
    limit: limit,
    offset: offset,
  })

  const totalArticles = await db
    .select({ count: count() })
    .from(article)
    .where(and(eq(article.category, category), eq(article.softDelete, false)))

  return {
    articles,
    totalPages: Math.ceil(totalArticles[0].count / limit),
  }
}

export const getArticle = async (articleSlug: string) => {
  const articleBySlug = await db.query.article.findFirst({
    where: (a, { eq, and }) => and(eq(a.slug, articleSlug), eq(a.softDelete, false)),
    with: {
      author: {
        columns: publicUserSelect,
      },
    },
  })

  if (!articleBySlug) throw new Error('Article not found')

  return articleBySlug
}

export const getArticleByUserId = async (userId: string, page: number = 1) => {
  const limit = 10
  const offset = (page - 1) * limit

  const articles = await db.query.article.findMany({
    where: (article, { eq, and }) =>
      and(eq(article.authorId, userId), eq(article.softDelete, false)),
    orderBy: (article, { desc }) => [desc(article.createdAt)],
    limit: limit,
    offset: offset,
  })

  if (!articles) throw new Error('News not found')

  return articles
}

export const getArticlesByUserIdPaginated = async (
  userId: string,
  page: number = 1,
  search: string = '',
) => {
  const limit = ROWS_PER_PAGE
  const offset = (Math.max(1, page) - 1) * limit
  const term = sanitizeIlikeTerm(search)
  const q = term ? `%${term}%` : null

  const countWhere = () => {
    const active = and(eq(article.authorId, userId), eq(article.softDelete, false))
    if (!q) return active
    return and(active, or(ilike(article.title, q), ilike(article.slug, q), ilike(article.category, q)))
  }

  const articles = await db.query.article.findMany({
    where: (a, { eq, and, or, ilike }) => {
      const active = and(eq(a.authorId, userId), eq(a.softDelete, false))
      if (!q) return active
      return and(active, or(ilike(a.title, q), ilike(a.slug, q), ilike(a.category, q)))
    },
    with: {
      author: {
        columns: publicUserSelect,
      },
    },
    orderBy: (a, { desc }) => [desc(a.createdAt)],
    limit,
    offset,
  })

  const [totalResult] = await db.select({ total: count() }).from(article).where(countWhere())

  const totalPages = Math.max(1, Math.ceil(totalResult.total / limit))

  return {
    articles,
    totalPages,
    currentPage: Math.max(1, page),
  }
}

export const getSoftDeletedArticlesPaginated = async (page: number = 1, search: string = '') => {
  await requireAdminUser()

  const limit = ROWS_PER_PAGE
  const offset = (Math.max(1, page) - 1) * limit
  const term = sanitizeIlikeTerm(search)
  const q = term ? `%${term}%` : null

  const countWhere = () => {
    const base = eq(article.softDelete, true)
    if (!q) return base
    return and(base, or(ilike(article.title, q), ilike(article.slug, q), ilike(article.category, q)))
  }

  const rows = await db.query.article.findMany({
    where: (a, { eq, and, or, ilike }) => {
      const base = eq(a.softDelete, true)
      if (!q) return base
      return and(base, or(ilike(a.title, q), ilike(a.slug, q), ilike(a.category, q)))
    },
    with: {
      author: { columns: publicUserSelect },
    },
    orderBy: (a, { desc }) => [desc(a.deletedAt), desc(a.createdAt)],
    limit,
    offset,
  })

  const [totalResult] = await db.select({ total: count() }).from(article).where(countWhere())
  const totalPages = Math.max(1, Math.ceil(totalResult.total / limit))

  return {
    articles: rows,
    totalPages,
    currentPage: Math.max(1, page),
  }
}

export const permanentlyDeleteArticle = async (articleId: string) => {
  await requireAdminUser()

  if (!articleId) {
    throw new Error('სტატიის იდენტიფიკატორი არ არის მითითებული')
  }

  const row = await db.query.article.findFirst({
    where: eq(article.id, articleId),
  })

  if (!row) {
    throw new Error('სტატია ვერ მოიძებნა')
  }

  if (!row.softDelete) {
    throw new Error('სრულად წაშლა შესაძლებელია მხოლოდ უკვე რბილად წაშლილი სტატიისთვის')
  }

  await destroyCloudinaryImageByUrl(row.coverImage)

  await db.delete(article).where(eq(article.id, articleId))

  return { ok: true as const }
}

export const softDeleteArticle = async (articleId: string) => {
  const sessionUser = await requireSessionUser()

  if (!articleId) {
    throw new Error('სტატიის იდენტიფიკატორი არ არის მითითებული')
  }

  const existing = await db.query.article.findFirst({
    where: eq(article.id, articleId),
  })

  if (!existing) {
    throw new Error('სტატია ვერ მოიძებნა')
  }

  if (existing.softDelete) {
    return existing
  }

  const isAdmin = sessionUser.role === 'admin'
  if (!isAdmin && existing.authorId !== sessionUser.id) {
    throw new Error('ამ სტატიის წაშლის უფლება არ გაქვთ')
  }

  await destroyCloudinaryImageByUrl(existing.coverImage)

  const [updated] = await db
    .update(article)
    .set({
      softDelete: true,
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(article.id, articleId))
    .returning()

  return updated
}

export const createArticle = async (values: any, authorId: string) => {
  let imageUrl = ''

  if (values.image) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(values.image, {
        folder: 'articles',
      })
      imageUrl = uploadResponse.secure_url
    } catch (err) {
      console.error('Cloudinary Error:', err)
      throw new Error('სურათის ატვირთვა ვერ მოხერხდა')
    }
  }

  const slug =
    values.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now()}`

  await db.insert(article).values({
    title: values.title,
    content: values.content,
    coverImage: imageUrl,
    badge: values.badge,
    category: values.category,
    authorId: authorId,
    slug: slug,
  })
  redirect('/')
}

export const updateArticle = async (slug: string, values: any) => {
  let imageUrl = values.image

  // If the image starts with "data:image", it's a new Base64 string from the client
  if (values.image && values.image.startsWith('data:image')) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(values.image, {
        folder: 'articles',
      })
      imageUrl = uploadResponse.secure_url
    } catch (err) {
      console.error('Cloudinary Error:', err)
      throw new Error('სურათის განახლება ვერ მოხერხდა')
    }
  }

  await db
    .update(article)
    .set({
      title: values.title,
      content: values.content,
      coverImage: imageUrl,
      badge: values.badge,
      category: values.category,
      updatedAt: new Date(),
    })
    .where(eq(article.slug, slug))
    .returning()

  redirect('/')
}
