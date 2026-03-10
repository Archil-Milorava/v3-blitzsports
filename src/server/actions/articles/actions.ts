import { db } from '@/src/drizzle'
import { article } from '@/src/drizzle/schema'
import { and, desc, eq } from 'drizzle-orm'

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
  const landingHistories = await db.query.article.findMany({
    where: and(eq(article.badge, 'history'), eq(article.softDelete, false)),
    orderBy: [desc(article.createdAt)],
    limit: 6,
  })

  if (!landingHistories) throw new Error('Histories not found')

  return landingHistories
}

export const getNewsByCategory = async (category: string, page: number = 1) => {
  const limit = 10
  const offset = (page - 1) * limit

  const articlesByCatogories = await db.query.article.findMany({
    where: (article, { eq, and }) =>
      and(eq(article.category, category), eq(article.softDelete, false)),
    orderBy: (article, { desc }) => [desc(article.createdAt)],
    limit: limit,
    offset: offset,
  })

  if (!articlesByCatogories) throw new Error('News not found')

  return articlesByCatogories
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
